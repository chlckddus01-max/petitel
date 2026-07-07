package com.petitel.backend.global.security.oauth2;

import com.petitel.backend.global.security.jwt.JwtProvider;
import com.petitel.backend.user.domain.User;
import com.petitel.backend.user.repository.UserMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

// 카카오 로그인이 "성공"한 바로 다음 단계. CustomOAuth2UserService가 이미 유저를 찾거나 만들어둔 뒤이므로,
// 여기서는 그 유저를 다시 조회해서 우리 서비스의 JWT를 발급하고 프론트로 돌려보내는 역할만 한다.
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;
    private final UserMapper userMapper;

    // 로그인 완료 후 리다이렉트할 프론트 콜백 경로. 프론트의 OAuthCallback.jsx가 여기서 token 쿼리를 읽는다.
    private static final String REDIRECT_URI = "http://localhost:5173/oauth/callback";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        // CustomOAuth2UserService가 만들어둔 인증 객체(카카오 원본 attributes)를 다시 꺼낸다.
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        Map<String, Object> attributes = oAuth2User.getAttributes();
        String providerId = String.valueOf(attributes.get("id"));

        // 직전 단계에서 이미 저장됐어야 하므로 없으면 이상 상태(코드 버그)로 간주.
        User user = userMapper.findByProviderAndProviderId("KAKAO", providerId)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        // 우리 서비스 전용 JWT 발급 (카카오 토큰이 아니라 이걸로 이후 모든 API를 인증한다).
        String token = jwtProvider.createToken(user.getId(), user.getEmail(), user.getName());

        // 프론트는 이 쿼리파라미터의 token을 localStorage에 저장하고 홈으로 이동.
        getRedirectStrategy().sendRedirect(request, response, REDIRECT_URI + "?token=" + token);
    }
}