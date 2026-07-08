package com.petitel.backend.hotel.repository;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

// 목록 조회에서 호텔별 편의시설 태그를 한 번의 쿼리로 배치 조회하기 위한 내부 매퍼 결과 행.
// API로 직접 노출되지 않으므로 hotel.dto가 아니라 repository 패키지에 둔다.
@Getter
@NoArgsConstructor
public class HotelFacilityTagRow {
    private UUID hotelId;
    private String name;
}
