package com.petitel.backend.user.domain;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

// 도메인 객체: users 테이블 한 행을 그대로 표현한다(전체 컬럼 보유). MyBatis가 UserMapper.xml의
// resultMap/파라미터 매핑으로 리플렉션을 통해 이 클래스를 채우고 읽으므로 별도 ORM 어노테이션은 필요 없다.
// API 요청/응답 모양이 아니라 "DB에 실제로 저장되는 상태"가 기준이라서,
// 생성자 두 개(LOCAL 가입 / 소셜 가입)로만 만들 수 있게 막아 항상 필요한 필드가 함께 채워지도록 한다.
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    // 사용자 고유 식별자. DB 자동증가가 아니라 생성자에서 UUID.randomUUID()로 직접 채운다.
    private UUID id;

    // 로그인 아이디 역할. UNIQUE라서 같은 이메일로 중복 가입 불가.
    private String email;

    // 암호화된 비밀번호. 소셜 전용 가입자는 비밀번호가 없어서 NULL 허용.
    private String password;

    // 가입 방식: "LOCAL"(이메일 가입) 또는 "KAKAO"(소셜 가입).
    private String provider;

    // 소셜 로그인 시 카카오 등 provider가 발급한 고유 ID. LOCAL 가입자는 NULL.
    private String providerId;

    // 이름.
    private String name;

    // 휴대폰 번호. UNIQUE라서 같은 번호로 중복 가입 불가.
    // 카카오 가입은 실제 번호를 안 받아서 CustomOAuth2UserService에서 임시 placeholder 값을 채워 넣는다.
    private String phone;

    // 휴대폰 본인인증 완료 여부. 지금은 인증 기능이 없어서 항상 false로 시작.
    private boolean phoneVerified;

    // 서비스 이용약관 동의 여부(필수). 회원가입 시 UserService가 false면 가입을 막는다.
    private boolean termsAgreed;

    // 개인정보 처리방침 동의 여부(필수).
    private boolean privacyAgreed;

    // 마케팅 정보 수신 동의 여부(선택).
    private boolean marketingAgreed;

    // 위 세 약관에 동의한 시각. 생성자에서 가입 시각과 동일하게 채운다.
    private LocalDateTime agreedAt;

    // 계정 상태: "ACTIVE" / "WITHDRAWN" / "SUSPENDED". 지금은 항상 ACTIVE로 시작.
    private String status;

    // 가입일시.
    private LocalDateTime createdAt;

    // 정보 수정일시. 지금은 별도 수정 기능이 없어서 가입일시와 항상 같다.
    private LocalDateTime updatedAt;

    public User(String email, String password, String name, String phone,
                boolean termsAgreed, boolean privacyAgreed, boolean marketingAgreed) {
        this.id = UUID.randomUUID();
        this.email = email;
        this.password = password;
        this.name = name;
        this.phone = phone;
        this.provider = "LOCAL";
        this.phoneVerified = false;
        this.termsAgreed = termsAgreed;
        this.privacyAgreed = privacyAgreed;
        this.marketingAgreed = marketingAgreed;
        LocalDateTime now = LocalDateTime.now();
        this.agreedAt = now;
        this.status = "ACTIVE";
        this.createdAt = now;
        this.updatedAt = now;
    }

    public User(String email, String name, String phone, String provider, String providerId) {
        this.id = UUID.randomUUID();
        this.email = email;
        this.name = name;
        this.phone = phone;
        this.provider = provider;
        this.providerId = providerId;
        this.phoneVerified = false;
        this.termsAgreed = true;
        this.privacyAgreed = true;
        this.marketingAgreed = false;
        LocalDateTime now = LocalDateTime.now();
        this.agreedAt = now;
        this.status = "ACTIVE";
        this.createdAt = now;
        this.updatedAt = now;
    }
}
