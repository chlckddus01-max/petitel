package com.petitel.backend.pet.domain;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

// 도메인 객체: pets 테이블 한 행을 그대로 표현한다. User.java와 같은 패턴 —
// 생성자에서 UUID.randomUUID()/현재시각을 직접 채워서 항상 유효한 상태로만 만들어지게 한다.
// MyBatis가 PetMapper.xml의 resultMap/파라미터 매핑으로 리플렉션을 통해 다루므로 ORM 어노테이션은 불필요.
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Pet {

    private UUID id;

    private UUID userId;

    private String name;

    // "DOG" / "CAT" / "ETC". DB에도 CHECK 제약이 있지만 API 단(PetCreateRequest)에서 먼저 걸러 명확한 에러 메시지를 준다.
    private String species;

    private String breed;

    private BigDecimal weight;

    private Integer age;

    private boolean neutered;

    private String notes;

    private LocalDateTime createdAt;

    public Pet(UUID userId, String name, String species, String breed,
               BigDecimal weight, Integer age, boolean neutered, String notes) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.name = name;
        this.species = species;
        this.breed = breed;
        this.weight = weight;
        this.age = age;
        this.neutered = neutered;
        this.notes = notes;
        this.createdAt = LocalDateTime.now();
    }
}
