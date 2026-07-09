package com.petitel.backend.user.controller;

import com.petitel.backend.user.dto.MarketingAgreedRequest;
import com.petitel.backend.user.dto.MyPageSummaryResponse;
import com.petitel.backend.user.dto.PasswordChangeRequest;
import com.petitel.backend.user.dto.ProfileUpdateRequest;
import com.petitel.backend.user.dto.SignupRequest;
import com.petitel.backend.user.dto.SignupResponse;
import com.petitel.backend.user.dto.UserMeResponse;
import com.petitel.backend.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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

    @GetMapping("/me")
    public UserMeResponse getMe(@AuthenticationPrincipal UUID userId) {
        return userService.getMe(userId);
    }

    @GetMapping("/me/summary")
    public MyPageSummaryResponse getSummary(@AuthenticationPrincipal UUID userId) {
        return userService.getSummary(userId);
    }

    @PatchMapping("/me")
    public void updateProfile(@AuthenticationPrincipal UUID userId, @Valid @RequestBody ProfileUpdateRequest request) {
        userService.updateProfile(userId, request);
    }

    @PatchMapping("/me/password")
    public void changePassword(@AuthenticationPrincipal UUID userId, @Valid @RequestBody PasswordChangeRequest request) {
        userService.changePassword(userId, request);
    }

    @PatchMapping("/me/marketing")
    public void updateMarketingAgreed(@AuthenticationPrincipal UUID userId, @RequestBody MarketingAgreedRequest request) {
        userService.updateMarketingAgreed(userId, request.isMarketingAgreed());
    }

    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void withdraw(@AuthenticationPrincipal UUID userId) {
        userService.withdraw(userId);
    }
}
