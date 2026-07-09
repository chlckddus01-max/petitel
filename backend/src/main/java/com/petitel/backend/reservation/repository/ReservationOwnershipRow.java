package com.petitel.backend.reservation.repository;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

// 리뷰 작성 시 "이 예약이 이 사용자 것이 맞는지 + 리뷰를 쓸 수 있는 상태인지" 검증에만 쓰는 최소 정보.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservationOwnershipRow {
    private UUID id;
    private UUID hotelId;
    private String status;
    private LocalDate checkOut;
}