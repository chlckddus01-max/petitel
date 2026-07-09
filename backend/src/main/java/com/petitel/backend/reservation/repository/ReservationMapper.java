package com.petitel.backend.reservation.repository;

import com.petitel.backend.reservation.domain.Reservation;
import com.petitel.backend.reservation.dto.ReservationResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
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

    Optional<ReservationOwnershipRow> findByIdAndUserId(@Param("reservationId") UUID reservationId,
                                                          @Param("userId") UUID userId);

    // 마이페이지 요약: 오늘 기준 아직 체크아웃 전인 PENDING/CONFIRMED 건수.
    int countUpcoming(@Param("userId") UUID userId, @Param("today") LocalDate today);

    // 마이페이지 요약: CONFIRMED + 체크아웃 경과 = "이용완료" (설계서 정의를 그대로 따름, 별도 배치로 상태를 바꾸지 않음).
    int countCompleted(@Param("userId") UUID userId, @Param("today") LocalDate today);

    // 마이페이지 요약 카드의 "다가오는 예약 1건 미리보기"용. 체크인이 가장 가까운 건 하나.
    Optional<ReservationResponse> findNextUpcoming(@Param("userId") UUID userId, @Param("today") LocalDate today);

    // 예약 목록 화면에서 "이용완료" 건에 리뷰 작성 여부를 표시하기 위한 예약id -> 리뷰존재여부 조회는
    // review 패키지의 ReviewMapper.findReviewedReservationIds에서 처리한다.
}
