package com.petitel.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 이메일은 계정 식별자라 여기 포함하지 않는다(설계서: 수정 불가, 비활성 처리).
@Getter
@NoArgsConstructor
public class ProfileUpdateRequest {

    @NotBlank(message = "이름은 필수입니다.")
    private String name;

    @NotBlank(message = "휴대폰 번호는 필수입니다.")
    private String phone;
}