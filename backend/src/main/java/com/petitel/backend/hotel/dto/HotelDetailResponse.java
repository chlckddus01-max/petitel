package com.petitel.backend.hotel.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class HotelDetailResponse {
    private UUID id;
    private String name;
    private String address;
    private String description;
    private double rating;
    private int reviewCount;
    private String image;
    private List<String> images;
    private List<FacilityResponse> facilities;
    private List<RoomResponse> rooms;
    private List<ReviewResponse> reviews;
}
