package com.petitel.backend.reservation.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class ReservationResponse {
    private UUID id;
    private UUID hotelId;
    private String hotelName;
    private String roomName;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private int nights;
    private int totalPrice;
    private String status;
    private String requestNote;
    private List<String> petNames;
    private LocalDateTime createdAt;
}
