package com.petitel.backend.auth.service;

import com.petitel.backend.auth.dto.LoginRequest;
import com.petitel.backend.auth.dto.LoginResponse;
import com.petitel.backend.global.security.jwt.JwtProvider;
import com.petitel.backend.user.domain.User;
import com.petitel.backend.user.repository.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// 이메일/비밀번호 로그인 비즈니스 로직. 카카오 로그인(OAuth2AuthenticationSuccessHandler)과는 흐름이 다르지만,
// 최종적으로 같은 JwtProvider로 같은 형태의 토큰을 발급해서 프론트가 두 로그인 방식을 구분하지 않고 쓸 수 있게 한다.
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public LoginResponse login(LoginRequest request) {
        // 이메일이 존재하지 않는 경우와 비밀번호가 틀린 경우 메시지를 똑같이 준다.
        // "이 이메일은 가입 안 됐어요"처럼 구분해서 알려주면 공격자가 가입된 이메일 목록을 추려낼 수 있어서(계정 탐지) 일부러 뭉뚱그린다.
        User user = userMapper.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        // 카카오 전용 가입자는 password가 NULL이라 matches() 자체를 호출하면 NPE가 나므로 먼저 걸러낸다.
        if (user.getPassword() == null) {
            throw new IllegalArgumentException("소셜 로그인으로 가입된 계정입니다. 카카오 로그인을 이용해주세요.");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
        if (!"ACTIVE".equals(user.getStatus())) {
            throw new IllegalArgumentException("이용할 수 없는 계정입니다.");
        }

        String token = jwtProvider.createToken(user.getId(), user.getEmail(), user.getName());
        return new LoginResponse(token);
    }
}
