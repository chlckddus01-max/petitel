package com.petitel.backend.hotel.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rooms")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer pricePerNight;

    private Integer pricePerHour;

    @Column(nullable = false)
    private Integer maxCapacity;

    private Double maxWeight;

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RoomImage> images = new ArrayList<>();

    public Room(Hotel hotel, String name, String description, Integer pricePerNight,
                Integer pricePerHour, Integer maxCapacity, Double maxWeight) {
        this.hotel = hotel;
        this.name = name;
        this.description = description;
        this.pricePerNight = pricePerNight;
        this.pricePerHour = pricePerHour;
        this.maxCapacity = maxCapacity;
        this.maxWeight = maxWeight;
    }
}