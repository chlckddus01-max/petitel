package com.petitel.backend.user.dto;

import com.petitel.backend.reservation.dto.ReservationResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MyPageSummaryResponse {
    private int upcomingReservationCount;
    private int completedReservationCount;
    private int wishlistCount;
    // 다가오는 예약이 없으면 null.
    private ReservationResponse nextReservation;
}