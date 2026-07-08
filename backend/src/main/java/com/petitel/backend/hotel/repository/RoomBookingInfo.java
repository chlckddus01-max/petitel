package com.petitel.backend.hotel.repository;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

// 예약 생성 시에만 필요한 객실+호텔 조합 정보. hotel.dto의 RoomResponse(목록/상세 화면용)와는
// 목적이 달라서 섞지 않고 repository 패키지에 내부용으로 둔다.
@Getter
@NoArgsConstructor
public class RoomBookingInfo {
    private UUID id;
    private UUID hotelId;
    private String hotelName;
    private String name;
    private int pricePerNight;
    private int maxPets;
    private String status;
    private String hotelStatus;
}
