package com.petitel.backend.hotel.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

// 목록 화면용 DTO. 매퍼가 기본 필드를 먼저 채우고, HotelService가 태그(편의시설명 목록)를 나중에 채운다.
@Getter
@Setter
@NoArgsConstructor
public class HotelSummaryResponse {
    private UUID id;
    private String name;
    private String address;
    private double rating;
    private int reviewCount;
    private Integer pricePerNight;
    private String image;
    private List<String> tags;
}
