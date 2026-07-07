package com.petitel.backend.user.controller;

import com.petitel.backend.user.dto.SignupRequest;
import com.petitel.backend.user.dto.SignupResponse;
import com.petitel.backend.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

// HTTP 진입점. 요청을 검증(@Valid)하고 그대로 UserService에 위임할 뿐, 비즈니스 로직은 없다.
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // POST /api/users/signup. SecurityConfig에서 이 경로만 인증 없이 접근 허용해뒀다.
    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public SignupResponse signup(@Valid @RequestBody SignupRequest request) {
        return userService.signup(request);
    }
}
