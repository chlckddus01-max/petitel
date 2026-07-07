package com.petitel.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

// 응답 DTO: 로그인 성공 시 프론트에 발급 토큰만 돌려준다.
// 프론트는 이 값을 localStorage의 accessToken으로 저장하고, 이후 모든 API 요청에 Bearer로 붙여 쓴다.
@Getter
@AllArgsConstructor
public class LoginResponse {

    private String accessToken;
}
