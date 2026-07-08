package com.petitel.backend.pet.repository;

import com.petitel.backend.pet.domain.Pet;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.UUID;

@Mapper
public interface PetMapper {

    void insert(Pet pet);

    List<Pet> findByUserId(@Param("userId") UUID userId);

    // 예약 생성 시 "선택한 petId들이 전부 이 사용자 소유인가"를 한 번에 검증하면서 이름도 함께 받아온다.
    // 반환된 리스트 크기가 petIds 크기와 다르면 소유하지 않은(혹은 존재하지 않는) id가 섞여있다는 뜻.
    List<Pet> findByIdsAndUserId(@Param("petIds") List<UUID> petIds, @Param("userId") UUID userId);

    // 반환값이 삭제된 행 수(0 또는 1). 소유자가 아니거나 존재하지 않으면 0이 되어
    // 서비스 레이어에서 "찾을 수 없음"과 "권한 없음"을 하나의 조건으로 안전하게 처리할 수 있다.
    int deleteByIdAndUserId(@Param("petId") UUID petId, @Param("userId") UUID userId);
}
