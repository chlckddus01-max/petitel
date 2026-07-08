package com.petitel.backend.hotel.service;

import com.petitel.backend.hotel.dto.FacilityResponse;
import com.petitel.backend.hotel.dto.HotelDetailResponse;
import com.petitel.backend.hotel.dto.HotelPageResponse;
import com.petitel.backend.hotel.dto.HotelSummaryResponse;
import com.petitel.backend.hotel.repository.HotelMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

// 목록/상세 모두 기본 정보와 편의시설·객실·리뷰를 별도 쿼리로 나눠 조회한 뒤 여기서 하나로 조립한다.
// 호텔 수가 적은 MVP 단계라 N+1이어도 문제없고, 매퍼의 SQL을 단순하게 유지하는 쪽을 택했다.
@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelMapper hotelMapper;

    public HotelPageResponse getHotels(String search, List<String> facilities, int page, int size) {
        int safeSize = Math.max(size, 1);
        // MyBatis가 #{facilities.size}처럼 List 파라미터에 바로 .size를 물으면 내부적으로
        // CollectionWrapper가 property access를 막아버려서 예외가 난다. 그래서 개수를 미리 계산해 별도 파라미터로 넘긴다.
        int facilityCount = facilities == null ? 0 : facilities.size();

        long totalCount = hotelMapper.countSummaries(search, facilities, facilityCount);
        int totalPages = (int) Math.max(1, Math.ceil((double) totalCount / safeSize));
        int currentPage = Math.min(Math.max(page, 1), totalPages);
        int offset = (currentPage - 1) * safeSize;

        List<HotelSummaryResponse> hotels = hotelMapper.findSummaries(search, facilities, facilityCount, offset, safeSize);
        hotels.forEach(hotel -> hotel.setTags(hotelMapper.findFacilityNamesByHotelId(hotel.getId())));

        return new HotelPageResponse(hotels, currentPage, totalPages, totalCount);
    }

    public List<FacilityResponse> getFacilities() {
        return hotelMapper.findAllFacilities();
    }

    public HotelDetailResponse getHotelDetail(UUID hotelId) {
        HotelDetailResponse hotel = hotelMapper.findDetailById(hotelId)
                .orElseThrow(() -> new IllegalArgumentException("호텔을 찾을 수 없습니다."));
        hotel.setImages(hotelMapper.findImageUrlsByHotelId(hotelId));
        hotel.setFacilities(hotelMapper.findFacilitiesByHotelId(hotelId));
        hotel.setRooms(hotelMapper.findRoomsByHotelId(hotelId));
        hotel.setReviews(hotelMapper.findReviewsByHotelId(hotelId));
        return hotel;
    }
}
