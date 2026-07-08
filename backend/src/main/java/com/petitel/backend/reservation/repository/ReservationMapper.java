package com.petitel.backend.reservation.repository;

import com.petitel.backend.reservation.domain.Reservation;
import com.petitel.backend.reservation.dto.ReservationResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Mapper
public interface ReservationMapper {

    // 같은 객실에 날짜가 겹치는 PENDING/CONFIRMED 예약이 있는지 카운트 (더블부킹 방지).
    long countOverlapping(@Param("roomId") UUID roomId,
                           @Param("checkIn") LocalDate checkIn,
                           @Param("checkOut") LocalDate checkOut);

    void insert(Reservation reservation);

    void insertPetLinks(@Param("reservationId") UUID reservationId, @Param("petIds") List<UUID> petIds);

    List<ReservationResponse> findByUserId(@Param("userId") UUID userId);

    List<ReservationPetNameRow> findPetNamesByReservationIds(@Param("reservationIds") List<UUID> reservationIds);
}
