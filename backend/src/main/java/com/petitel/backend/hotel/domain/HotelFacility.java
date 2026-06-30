package com.petitel.backend.hotel.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hotel_facilities")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HotelFacility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private HotelFacilityType facilityType;

    public HotelFacility(Hotel hotel, HotelFacilityType facilityType) {
        this.hotel = hotel;
        this.facilityType = facilityType;
    }
}