package com.petitel.backend.reservation.domain;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

// 도메인 객체: reservations 테이블 한 행. User/Pet과 동일한 패턴 —
// 생성자에서 id/status/시각을 직접 채워서 항상 유효한 PENDING 상태로만 만들어지게 한다.
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Reservation {

    private UUID id;
    private UUID userId;
    private UUID hotelId;
    private UUID roomId;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String status;
    private String requestNote;
    private int totalPrice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Reservation(UUID userId, UUID hotelId, UUID roomId, LocalDate checkIn, LocalDate checkOut,
                        int totalPrice, String requestNote) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.hotelId = hotelId;
        this.roomId = roomId;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.status = "PENDING";
        this.requestNote = requestNote;
        this.totalPrice = totalPrice;
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }
}
