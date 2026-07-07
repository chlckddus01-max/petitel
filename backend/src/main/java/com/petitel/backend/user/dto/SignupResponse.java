package com.petitel.backend.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

// 응답 DTO: 클라이언트에게 보여줄 필드만 담는다.
// User 엔티티를 그대로 반환하면 password 같은 내부 값까지 JSON에 노출되므로 여기서 걸러낸다.
@Getter
@AllArgsConstructor
public class SignupResponse {

    private UUID id;
    private String email;
    private String name;
    // 가입 즉시 로그인 상태로 만들어주기 위한 토큰. 카카오 가입/로그인이 한 흐름인 것과 동일하게 맞춘다.
    private String accessToken;
}
