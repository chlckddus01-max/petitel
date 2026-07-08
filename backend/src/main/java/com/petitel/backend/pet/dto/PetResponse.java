package com.petitel.backend.pet.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class PetResponse {
    private UUID id;
    private String name;
    private String species;
    private String breed;
    private BigDecimal weight;
    private Integer age;
    private boolean neutered;
    private String notes;
    private LocalDateTime createdAt;
}
