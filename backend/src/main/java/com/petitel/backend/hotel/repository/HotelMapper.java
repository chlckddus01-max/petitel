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

    List<String> findFacilityNamesByHotelId(@Param("hotelId") UUID hotelId);

    List<FacilityResponse> findFacilitiesByHotelId(@Param("hotelId") UUID hotelId);

    List<String> findImageUrlsByHotelId(@Param("hotelId") UUID hotelId);

    List<RoomResponse> findRoomsByHotelId(@Param("hotelId") UUID hotelId);

    List<ReviewResponse> findReviewsByHotelId(@Param("hotelId") UUID hotelId);
}
