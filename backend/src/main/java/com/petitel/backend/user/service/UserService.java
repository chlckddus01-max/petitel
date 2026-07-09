package com.petitel.backend.user.service;

import com.petitel.backend.global.security.jwt.JwtProvider;
import com.petitel.backend.reservation.repository.ReservationMapper;
import com.petitel.backend.user.domain.User;
import com.petitel.backend.user.dto.MyPageSummaryResponse;
import com.petitel.backend.user.dto.PasswordChangeRequest;
import com.petitel.backend.user.dto.ProfileUpdateRequest;
import com.petitel.backend.user.dto.SignupRequest;
import com.petitel.backend.user.dto.SignupResponse;
import com.petitel.backend.user.dto.UserMeResponse;
import com.petitel.backend.user.repository.UserMapper;
import com.petitel.backend.wishlist.repository.WishlistMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

// 회원가입 비즈니스 로직. 컨트롤러는 이걸 그대로 호출만 하고, 검증/중복체크/저장은 전부 여기서 처리한다.
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final ReservationMapper reservationMapper;
    private final WishlistMapper wishlistMapper;

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

    public UserMeResponse getMe(UUID userId) {
        User user = getActiveUser(userId);
        return new UserMeResponse(user.getId(), user.getEmail(), user.getName(), user.getPhone(),
                user.getProvider(), user.isMarketingAgreed());
    }

    public void updateProfile(UUID userId, ProfileUpdateRequest request) {
        User user = getActiveUser(userId);
        // 값이 바뀐 경우에만 중복 체크한다. 그대로 재저장(no-op)까지 "이미 가입된 번호"로 막아버리면 안 되니까.
        if (!request.getPhone().equals(user.getPhone()) && userMapper.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("이미 가입된 휴대폰 번호입니다.");
        }
        userMapper.updateProfile(userId, request.getName(), request.getPhone());
    }

    public void changePassword(UUID userId, PasswordChangeRequest request) {
        User user = getActiveUser(userId);
        // 카카오 전용 가입자는 password가 NULL이라 비밀번호 변경 대상이 아니다.
        if (user.getPassword() == null) {
            throw new IllegalArgumentException("소셜 로그인 계정은 비밀번호를 변경할 수 없습니다.");
        }
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 올바르지 않습니다.");
        }
        userMapper.updatePassword(userId, passwordEncoder.encode(request.getNewPassword()));
    }

    public void updateMarketingAgreed(UUID userId, boolean marketingAgreed) {
        userMapper.updateMarketingAgreed(userId, marketingAgreed);
    }

    public void withdraw(UUID userId) {
        getActiveUser(userId);
        // 진행중(체크아웃 전, PENDING/CONFIRMED) 예약이 있으면 탈퇴를 막는다 — 설계서 요구사항.
        if (reservationMapper.countUpcoming(userId, LocalDate.now()) > 0) {
            throw new IllegalArgumentException("진행 중인 예약이 있어 탈퇴할 수 없습니다. 예약을 취소한 뒤 다시 시도해주세요.");
        }
        userMapper.withdraw(userId);
    }

    public MyPageSummaryResponse getSummary(UUID userId) {
        LocalDate today = LocalDate.now();
        int upcoming = reservationMapper.countUpcoming(userId, today);
        int completed = reservationMapper.countCompleted(userId, today);
        int wishlistCount = wishlistMapper.countByUserId(userId);
        var nextReservation = reservationMapper.findNextUpcoming(userId, today).orElse(null);
        return new MyPageSummaryResponse(upcoming, completed, wishlistCount, nextReservation);
    }

    private User getActiveUser(UUID userId) {
        return userMapper.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }
}