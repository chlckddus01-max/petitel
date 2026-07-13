package com.petitel.backend.hotel.controller;

import com.petitel.backend.hotel.dto.FacilityResponse;
import com.petitel.backend.hotel.dto.HotelDetailResponse;
import com.petitel.backend.hotel.dto.HotelPageResponse;
import com.petitel.backend.hotel.dto.ReviewResponse;
import com.petitel.backend.hotel.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

// 호텔 목록/상세 조회는 로그인 없이도 볼 수 있어야 해서 SecurityConfig에서 permitAll 처리해뒀다.
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/hotels")
public class HotelController {

    private final HotelService hotelService;

    @GetMapping
    public HotelPageResponse getHotels(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> facility,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        return hotelService.getHotels(search, facility, page, size);
    }

    @GetMapping("/facilities")
    public List<FacilityResponse> getFacilities() {
        return hotelService.getFacilities();
    }

    @GetMapping("/{hotelId}")
    public HotelDetailResponse getHotelDetail(@PathVariable UUID hotelId) {
        return hotelService.getHotelDetail(hotelId);
    }

    @GetMapping("/{hotelId}/reviews")
    public List<ReviewResponse> getAllReviews(@PathVariable UUID hotelId) {
        return hotelService.getAllReviews(hotelId);
    }
}
