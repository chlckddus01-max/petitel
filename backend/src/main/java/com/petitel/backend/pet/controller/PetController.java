package com.petitel.backend.pet.controller;

import com.petitel.backend.pet.dto.PetCreateRequest;
import com.petitel.backend.pet.dto.PetResponse;
import com.petitel.backend.pet.service.PetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

// 반려동물 등록/조회/삭제. SecurityConfig에서 별도 permitAll을 안 걸어뒀기 때문에
// anyRequest().authenticated()에 걸려 전부 로그인 필요.
// JwtAuthenticationFilter가 인증 principal 자리에 userId(UUID)를 그대로 넣어두므로
// @AuthenticationPrincipal UUID로 바로 꺼내 쓸 수 있다(별도 UserDetails 구현 불필요).
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PetResponse registerPet(@AuthenticationPrincipal UUID userId,
                                    @Valid @RequestBody PetCreateRequest request) {
        return petService.registerPet(userId, request);
    }

    @GetMapping
    public List<PetResponse> getMyPets(@AuthenticationPrincipal UUID userId) {
        return petService.getMyPets(userId);
    }

    @DeleteMapping("/{petId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePet(@AuthenticationPrincipal UUID userId, @PathVariable UUID petId) {
        petService.deletePet(userId, petId);
    }
}
