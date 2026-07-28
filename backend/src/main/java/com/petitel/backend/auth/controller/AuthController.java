package com.petitel.backend.auth.controller;

import com.petitel.backend.auth.dto.LoginRequest;
import com.petitel.backend.auth.dto.LoginResponse;
import com.petitel.backend.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

// HTTP 진입점. UserController(회원가입=리소스 생성)와는 별도로, 인증 관련 엔드포인트를 모아두는 곳.
// 나중에 로그아웃, 토큰 재발급 등이 추가되면 여기에 메서드만 추가하면 된다.
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/login. SecurityConfig에서 이 경로만 인증 없이 접근 허용해뒀다.
    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}