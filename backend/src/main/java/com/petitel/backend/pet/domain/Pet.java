package com.petitel.backend.pet.domain;

import com.petitel.backend.user.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pets")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(length = 50)
    private String breed;

    private Integer age;

    private Double weight;

    @Column(length = 10)
    private String gender;

    @Column(nullable = false)
    private boolean hasChip;

    @Column(length = 500)
    private String specialNotes;

    public Pet(User user, String name, String breed, Integer age, Double weight,
               String gender, boolean hasChip, String specialNotes) {
        this.user = user;
        this.name = name;
        this.breed = breed;
        this.age = age;
        this.weight = weight;
        this.gender = gender;
        this.hasChip = hasChip;
        this.specialNotes = specialNotes;
    }
}