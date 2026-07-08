package com.petitel.backend.hotel.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class HotelPageResponse {
    private List<HotelSummaryResponse> hotels;
    private int page;
    private int totalPages;
    private long totalCount;
}
