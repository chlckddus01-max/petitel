package com.petitel.backend.pet.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
public class PetCreateRequest {

    @NotBlank(message = "이름은 필수입니다.")
    @Size(max = 30, message = "이름은 30자 이하로 입력해주세요.")
    private String name;

    @NotBlank(message = "종류는 필수입니다.")
    @Pattern(regexp = "DOG|CAT|ETC", message = "종류는 DOG, CAT, ETC 중 하나여야 합니다.")
    private String species;

    @Size(max = 50, message = "품종은 50자 이하로 입력해주세요.")
    private String breed;

    @DecimalMin(value = "0.1", message = "몸무게는 0보다 커야 합니다.")
    @Digits(integer = 3, fraction = 1, message = "몸무게 형식이 올바르지 않습니다.")
    private BigDecimal weight;

    @Min(value = 0, message = "나이는 0 이상이어야 합니다.")
    @Max(value = 30, message = "나이는 30 이하여야 합니다.")
    private Integer age;

    private boolean neutered;

    @Size(max = 500, message = "메모는 500자 이하로 입력해주세요.")
    private String notes;
}
