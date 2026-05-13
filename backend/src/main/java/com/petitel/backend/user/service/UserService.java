package com.petitel.backend.user.service;

import com.petitel.backend.user.domain.User;
import com.petitel.backend.user.dto.SignupRequest;
import com.petitel.backend.user.dto.SignupResponse;
import com.petitel.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public SignupResponse signup(SignupRequest request) {
        if (!request.isTermsAgreed()) {
            throw new IllegalArgumentException("서비스 이용약관에 동의해주세요.");
        }
        if (!request.isPrivacyAgreed()) {
            throw new IllegalArgumentException("개인정보 처리방침에 동의해주세요.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

        User user = new User(
                request.getEmail(),
                request.getPassword(),
                request.getName(),
                request.getPhone(),
                request.isTermsAgreed(),
                request.isPrivacyAgreed(),
                request.isMarketingAgreed()
        );

        User savedUser = userRepository.save(user);

        return new SignupResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getName()
        );
    }
}