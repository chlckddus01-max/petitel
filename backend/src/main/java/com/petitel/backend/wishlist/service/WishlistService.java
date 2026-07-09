package com.petitel.backend.wishlist.service;

import com.petitel.backend.hotel.dto.HotelSummaryResponse;
import com.petitel.backend.hotel.repository.HotelFacilityTagRow;
import com.petitel.backend.hotel.repository.HotelMapper;
import com.petitel.backend.wishlist.dto.WishlistCreateRequest;
import com.petitel.backend.wishlist.repository.WishlistMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistMapper wishlistMapper;
    private final HotelMapper hotelMapper;

    public List<HotelSummaryResponse> getMyWishlist(UUID userId) {
        List<HotelSummaryResponse> hotels = wishlistMapper.findHotelSummariesByUserId(userId);
        attachTags(hotels);
        return hotels;
    }

    // 이미 찜한 호텔을 다시 찜하기해도 에러 없이 조용히 무시한다(멱등). hotel_id는 FK 제약이 있어
    // 존재하지 않는 호텔을 보내면 DB에서 바로 막힌다.
    public void addWishlist(UUID userId, WishlistCreateRequest request) {
        UUID hotelId = request.getHotelId();
        if (wishlistMapper.existsByUserIdAndHotelId(userId, hotelId)) return;

        wishlistMapper.insert(UUID.randomUUID(), userId, hotelId);
    }

    private void attachTags(List<HotelSummaryResponse> hotels) {
        if (hotels.isEmpty()) return;

        List<UUID> hotelIds = hotels.stream().map(HotelSummaryResponse::getId).toList();
        Map<UUID, List<String>> tagsByHotelId = hotelMapper.findFacilityNamesByHotelIds(hotelIds).stream()
                .collect(Collectors.groupingBy(
                        HotelFacilityTagRow::getHotelId,
                        Collectors.mapping(HotelFacilityTagRow::getName, Collectors.toList())));

        hotels.forEach(hotel -> hotel.setTags(tagsByHotelId.getOrDefault(hotel.getId(), List.of())));
    }

    public void removeWishlist(UUID userId, UUID hotelId) {
        wishlistMapper.deleteByUserIdAndHotelId(userId, hotelId);
    }
}