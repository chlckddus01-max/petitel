package com.petitel.backend.global.security.oauth2;

import com.petitel.backend.global.security.jwt.JwtProvider;
import com.petitel.backend.user.domain.User;
import com.petitel.backend.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    private static final String REDIRECT_URI = "http://localhost:5173/oauth/callback";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        Map<String, Object> attributes = oAuth2User.getAttributes();
        String providerId = String.valueOf(attributes.get("id"));

        User user = userRepository.findByProviderAndProviderId("KAKAO", providerId)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        String token = jwtProvider.createToken(user.getId(), user.getEmail(), user.getName());

        getRedirectStrategy().sendRedirect(request, response, REDIRECT_URI + "?token=" + token);
    }
}