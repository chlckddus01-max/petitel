package com.petitel.backend.reservation.controller;

import com.petitel.backend.reservation.dto.ReservationCreateRequest;
import com.petitel.backend.reservation.dto.ReservationResponse;
import com.petitel.backend.reservation.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

// 예약 생성/내역 조회. permitAll이 안 걸려있어 anyRequest().authenticated()에 의해 전부 로그인 필요.
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservationResponse createReservation(@AuthenticationPrincipal UUID userId,
                                                   @Valid @RequestBody ReservationCreateRequest request) {
        return reservationService.createReservation(userId, request);
    }

    @GetMapping
    public List<ReservationResponse> getMyReservations(@AuthenticationPrincipal UUID userId) {
        return reservationService.getMyReservations(userId);
    }
}
