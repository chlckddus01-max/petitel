package com.petitel.backend.wishlist.repository;

import com.petitel.backend.hotel.dto.HotelSummaryResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.UUID;

@Mapper
public interface WishlistMapper {

    // 이미 찜한 호텔을 중복으로 또 찜하려는 요청은 이 값으로 서비스 레이어에서 걸러낸다.
    boolean existsByUserIdAndHotelId(@Param("userId") UUID userId, @Param("hotelId") UUID hotelId);

    void insert(@Param("id") UUID id, @Param("userId") UUID userId, @Param("hotelId") UUID hotelId);

    // 반환값은 삭제된 행 수(0 또는 1) — 찜하지 않은 호텔을 삭제 요청해도 예외 없이 0으로 처리.
    int deleteByUserIdAndHotelId(@Param("userId") UUID userId, @Param("hotelId") UUID hotelId);

    int countByUserId(@Param("userId") UUID userId);

    // 호텔 카드 목록 화면과 동일한 모양(HotelSummaryResponse)으로 내려줘서 프론트가 그대로 재사용할 수 있게 한다.
    List<HotelSummaryResponse> findHotelSummariesByUserId(@Param("userId") UUID userId);
}