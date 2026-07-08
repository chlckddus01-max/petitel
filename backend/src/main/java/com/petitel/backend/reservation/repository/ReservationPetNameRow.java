package com.petitel.backend.reservation.repository;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

// 예약내역 목록에서 예약별 반려동물 이름을 한 번에 배치 조회하기 위한 내부 매퍼 결과 행 (N+1 방지).
@Getter
@NoArgsConstructor
public class ReservationPetNameRow {
    private UUID reservationId;
    private String name;
}
