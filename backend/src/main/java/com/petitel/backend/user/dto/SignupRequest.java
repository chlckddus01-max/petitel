package com.petitel.backend.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 요청 DTO: 회원가입 시 클라이언트가 실제로 보낼 수 있는 필드만 담는다.
// id, status 같은 서버가 정하는 값은 애초에 존재하지 않아서 클라이언트가 조작할 수 없다.
@Getter
@NoArgsConstructor
public class SignupRequest {

    @Email(message = "이메일 형식이 올바르지 않습니다.")
    @NotBlank(message = "이메일은 필수입니다.")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다.")
    private String password;

    @NotBlank(message = "이름은 필수입니다.")
    private String name;

    @NotBlank(message = "휴대폰 번호는 필수입니다.")
    private String phone;

    private boolean termsAgreed;

    private boolean privacyAgreed;

    private boolean marketingAgreed;
}