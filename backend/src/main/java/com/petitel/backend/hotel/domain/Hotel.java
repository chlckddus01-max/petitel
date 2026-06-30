package com.petitel.backend.hotel.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hotels")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 200)
    private String address;

    private Double latitude;

    private Double longitude;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 20)
    private String phone;

    @Column(length = 500)
    private String thumbnailUrl;

    @Column(nullable = false)
    private Double rating = 0.0;

    @Column(nullable = false)
    private Integer reviewCount = 0;

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HotelFacility> facilities = new ArrayList<>();

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Room> rooms = new ArrayList<>();

    public Hotel(String name, String address, Double latitude, Double longitude,
                 String description, String phone, String thumbnailUrl) {
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
        this.phone = phone;
        this.thumbnailUrl = thumbnailUrl;
    }
}