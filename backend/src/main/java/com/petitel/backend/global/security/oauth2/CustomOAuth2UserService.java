package com.petitel.backend.global.security.oauth2;

import com.petitel.backend.user.domain.User;
import com.petitel.backend.user.repository.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Map;

// 스프링 시큐리티의 OAuth2 로그인 흐름 중, 카카오에서 사용자 프로필을 받아온 "직후" 호출되는 훅.
// 여기서 처음 로그인하는 카카오 사용자면 users 테이블에 새로 만들어준다(자동 가입).
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserMapper userMapper;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 기본 구현체에게 실제 카카오 API 호출(프로필 조회)을 맡긴다.
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails()
                .getUserInfoEndpoint()
                .getUserNameAttributeName();

        Map<String, Object> attributes = oAuth2User.getAttributes();

        // 카카오가 발급한 유저 고유 id. 우리 DB의 provider_id로 저장/조회하는 키.
        String providerId = String.valueOf(attributes.get("id"));

        // getOrDefault는 키가 "없을 때"만 기본값을 쓰기 때문에, scope 동의를 안 해서 값이 null로 오는 경우
        // (키 자체는 있지만 값이 null)엔 그대로 null을 반환해 NPE로 이어진다. 그래서 직접 null 체크한다.
        Map<String, Object> kakaoAccount = asMap(attributes.get("kakao_account"));
        Map<String, Object> profile = asMap(kakaoAccount.get("profile"));

        String emailValue = (String) kakaoAccount.get("email");
        final String email = emailValue != null ? emailValue : providerId + "@kakao.local";

        String nameValue = (String) profile.get("nickname");
        final String name = nameValue != null ? nameValue : "카카오유저";

        // provider+providerId로 기존 유저 찾고, 없으면(첫 로그인) 새로 가입시킨다.
        userMapper.findByProviderAndProviderId("KAKAO", providerId)
                .orElseGet(() -> {
                    // users.phone은 NOT NULL + UNIQUE인데 카카오 기본 scope로는 번호를 안 주기 때문에,
                    // providerId 기반 임시 placeholder 값으로 채워 제약을 만족시킨다(실제 인증된 번호는 아님).
                    String placeholderPhone = ("K" + providerId).substring(0, Math.min(20, ("K" + providerId).length()));
                    User newUser = new User(email, name, placeholderPhone, "KAKAO", providerId);
                    userMapper.insert(newUser);
                    return newUser;
                });

        // 여기서 반환하는 건 "이번 요청의 인증 principal"일 뿐, 우리 User 엔티티가 아니라 카카오 원본 attributes를 담은 객체.
        // 실제 우리 서비스의 유저 식별/토큰 발급은 OAuth2AuthenticationSuccessHandler에서 따로 DB를 다시 조회해 처리한다.
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                attributes,
                userNameAttributeName
        );
    }

    // value가 null이거나 Map이 아니면 빈 맵을 반환해서 이후 .get() 호출이 NPE 없이 안전하게 null만 리턴하게 한다.
    @SuppressWarnings("unchecked")
    private Map<String, Object> asMap(Object value) {
        return value instanceof Map ? (Map<String, Object>) value : Map.of();
    }
}