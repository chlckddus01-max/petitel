package com.petitel.backend.reservation.service;

import com.petitel.backend.hotel.repository.HotelMapper;
import com.petitel.backend.hotel.repository.RoomBookingInfo;
import com.petitel.backend.pet.domain.Pet;
import com.petitel.backend.pet.repository.PetMapper;
import com.petitel.backend.reservation.domain.Reservation;
import com.petitel.backend.reservation.dto.ReservationCreateRequest;
import com.petitel.backend.reservation.dto.ReservationResponse;
import com.petitel.backend.reservation.repository.ReservationMapper;
import com.petitel.backend.reservation.repository.ReservationPetNameRow;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationMapper reservationMapper;
    private final HotelMapper hotelMapper;
    private final PetMapper petMapper;

    // 여러 INSERT(예약 1건 + reservation_pets N건)가 하나로 묶여야 하므로 트랜잭션으로 감싼다.
    @Transactional
    public ReservationResponse createReservation(UUID userId, ReservationCreateRequest request) {
        if (!request.getCheckOut().isAfter(request.getCheckIn())) {
            throw new IllegalArgumentException("체크아웃 날짜는 체크인 날짜보다 뒤여야 합니다.");
        }

        RoomBookingInfo room = hotelMapper.findRoomById(request.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("객실을 찾을 수 없습니다."));
        if (!"SALE".equals(room.getStatus()) || !"ACTIVE".equals(room.getHotelStatus())) {
            throw new IllegalArgumentException("현재 예약할 수 없는 객실입니다.");
        }

        List<Pet> pets = petMapper.findByIdsAndUserId(request.getPetIds(), userId);
        if (pets.size() != request.getPetIds().size()) {
            throw new IllegalArgumentException("본인 소유의 반려동물만 선택할 수 있습니다.");
        }
        if (pets.size() > room.getMaxPets()) {
            throw new IllegalArgumentException("이 객실은 최대 " + room.getMaxPets() + "마리까지 동반 가능합니다.");
        }

        if (reservationMapper.countOverlapping(request.getRoomId(), request.getCheckIn(), request.getCheckOut()) > 0) {
            throw new IllegalArgumentException("선택한 날짜에는 이미 예약이 꽉 찼습니다.");
        }

        long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
        int totalPrice = (int) (nights * room.getPricePerNight());

        Reservation reservation = new Reservation(userId, room.getHotelId(), request.getRoomId(),
                request.getCheckIn(), request.getCheckOut(), totalPrice, request.getRequestNote());
        reservationMapper.insert(reservation);
        reservationMapper.insertPetLinks(reservation.getId(), request.getPetIds());

        ReservationResponse response = new ReservationResponse();
        response.setId(reservation.getId());
        response.setHotelId(room.getHotelId());
        response.setHotelName(room.getHotelName());
        response.setRoomName(room.getName());
        response.setCheckIn(reservation.getCheckIn());
        response.setCheckOut(reservation.getCheckOut());
        response.setNights((int) nights);
        response.setTotalPrice(totalPrice);
        response.setStatus(reservation.getStatus());
        response.setRequestNote(reservation.getRequestNote());
        response.setPetNames(pets.stream().map(Pet::getName).toList());
        response.setCreatedAt(reservation.getCreatedAt());
        return response;
    }

    public List<ReservationResponse> getMyReservations(UUID userId) {
        List<ReservationResponse> reservations = reservationMapper.findByUserId(userId);
        attachPetNames(reservations);
        return reservations;
    }

    private void attachPetNames(List<ReservationResponse> reservations) {
        if (reservations.isEmpty()) return;

        List<UUID> reservationIds = reservations.stream().map(ReservationResponse::getId).toList();
        Map<UUID, List<String>> namesByReservationId = reservationMapper.findPetNamesByReservationIds(reservationIds).stream()
                .collect(Collectors.groupingBy(
                        ReservationPetNameRow::getReservationId,
                        Collectors.mapping(ReservationPetNameRow::getName, Collectors.toList())));

        reservations.forEach(r -> r.setPetNames(namesByReservationId.getOrDefault(r.getId(), List.of())));
    }
}
