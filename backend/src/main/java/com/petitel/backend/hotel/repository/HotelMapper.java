package com.petitel.backend.hotel.repository;

import com.petitel.backend.hotel.dto.FacilityResponse;
import com.petitel.backend.hotel.dto.HotelDetailResponse;
import com.petitel.backend.hotel.dto.HotelSummaryResponse;
import com.petitel.backend.hotel.dto.ReviewResponse;
import com.petitel.backend.hotel.dto.RoomResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Mapper
public interface HotelMapper {

    List<HotelSummaryResponse> findSummaries(@Param("search") String search,
                                              @Param("facilities") List<String> facilities,
                                              @Param("facilityCount") int facilityCount,
                                              @Param("offset") int offset,
                                              @Param("limit") int limit);

    long countSummaries(@Param("search") String search,
                         @Param("facilities") List<String> facilities,
                         @Param("facilityCount") int facilityCount);

    List<FacilityResponse> findAllFacilities();

    Optional<HotelDetailResponse> findDetailById(@Param("hotelId") UUID hotelId);

    // 목록 화면의 태그를 호텔마다 따로 안 물어보고 한 번에 배치 조회하기 위한 것 (N+1 방지).
    List<HotelFacilityTagRow> findFacilityNamesByHotelIds(@Param("hotelIds") List<UUID> hotelIds);

    List<FacilityResponse> findFacilitiesByHotelId(@Param("hotelId") UUID hotelId);

    List<String> findImageUrlsByHotelId(@Param("hotelId") UUID hotelId);

    List<RoomResponse> findRoomsByHotelId(@Param("hotelId") UUID hotelId);

    // 예약 생성 시 가격/최대동반마리수/판매상태를 서버가 직접 확인하기 위한 단건 조회 (클라이언트 값을 신뢰하지 않음).
    Optional<RoomBookingInfo> findRoomById(@Param("roomId") UUID roomId);

    // 호텔 상세 화면의 "최근 리뷰 3건 미리보기"용 (설계서 04번 화면 정의).
    List<ReviewResponse> findRecentReviewsByHotelId(@Param("hotelId") UUID hotelId, @Param("limit") int limit);

    // "전체보기" 클릭 시 개수 제한 없이 전부 조회.
    List<ReviewResponse> findAllReviewsByHotelId(@Param("hotelId") UUID hotelId);
}
