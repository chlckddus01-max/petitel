package com.petitel.backend.reservation.domain;

import com.petitel.backend.pet.domain.Pet;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reservation_pets")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ReservationPet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    public ReservationPet(Reservation reservation, Pet pet) {
        this.reservation = reservation;
        this.pet = pet;
    }
}