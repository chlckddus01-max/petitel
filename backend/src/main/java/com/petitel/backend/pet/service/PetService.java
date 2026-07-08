package com.petitel.backend.pet.service;

import com.petitel.backend.pet.domain.Pet;
import com.petitel.backend.pet.dto.PetCreateRequest;
import com.petitel.backend.pet.dto.PetResponse;
import com.petitel.backend.pet.repository.PetMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetMapper petMapper;

    public PetResponse registerPet(UUID userId, PetCreateRequest request) {
        Pet pet = new Pet(userId, request.getName(), request.getSpecies(), request.getBreed(),
                request.getWeight(), request.getAge(), request.isNeutered(), request.getNotes());
        petMapper.insert(pet);
        return toResponse(pet);
    }

    public List<PetResponse> getMyPets(UUID userId) {
        return petMapper.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public void deletePet(UUID userId, UUID petId) {
        int deleted = petMapper.deleteByIdAndUserId(petId, userId);
        if (deleted == 0) {
            throw new IllegalArgumentException("반려동물을 찾을 수 없습니다.");
        }
    }

    private PetResponse toResponse(Pet pet) {
        return new PetResponse(pet.getId(), pet.getName(), pet.getSpecies(), pet.getBreed(),
                pet.getWeight(), pet.getAge(), pet.isNeutered(), pet.getNotes(), pet.getCreatedAt());
    }
}
