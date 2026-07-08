package com.petitel.backend.hotel.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class RoomResponse {
    private UUID id;
    private String name;
    private int pricePerNight;
    private int maxPets;
}
