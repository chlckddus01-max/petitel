package com.petitel.backend.user.service;

import com.petitel.backend.global.security.jwt.JwtProvider;
import com.petitel.backend.user.domain.User;
import com.petitel.backend.user.dto.SignupRequest;
import com.petitel.backend.user.dto.SignupResponse;
import com.petitel.backend.user.repository.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// 회원가입 비즈니스 로직. 컨트롤러는 이걸 그대로 호출만 하고, 검증/중복체크/저장은 전부 여기서 처리한다.
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public SignupResponse signup(SignupRequest request) {
        // 필수 약관 동의 검증. DTO의 @NotBlank는 "값이 있는지"만 보고, boolean true 여부는 여기서 직접 체크.
        if (!request.isTermsAgreed()) {
            throw new IllegalArgumentException("서비스 이용약관에 동의해주세요.");
        }
        if (!request.isPrivacyAgreed()) {
            throw new IllegalArgumentException("개인정보 처리방침에 동의해주세요.");
        }
        // DB의 UNIQUE 제약(email, phone)에 그냥 부딫혀도 되지만, 사용자에게 명확한 한국어 메시지를 주기 위해
        // 미리 조회해서 걸러낸다.
        if (userMapper.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }
        if (userMapper.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("이미 가입된 휴대폰 번호입니다.");
        }

        // bcrypt로 해시한 값만 저장 — DB에도, 앞으로 어디에도 평문 비밀번호는 남지 않는다.
        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getName(),
                request.getPhone(),
                request.isTermsAgreed(),
                request.isPrivacyAgreed(),
                request.isMarketingAgreed()
        );

        userMapper.insert(user);

        // 카카오 가입/로그인이 한 흐름인 것처럼, 이메일 가입도 여기서 바로 토큰을 발급해 로그인 상태로 만든다.
        String accessToken = jwtProvider.createToken(user.getId(), user.getEmail(), user.getName());

        // password는 절대 SignupResponse에 담지 않는다.
        return new SignupResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                accessToken
        );
    }
}