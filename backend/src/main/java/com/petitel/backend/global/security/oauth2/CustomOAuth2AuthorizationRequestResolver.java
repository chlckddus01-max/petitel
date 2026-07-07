package com.petitel.backend.global.security.oauth2;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.oauth2.core.endpoint.PkceParameterNames;

import java.util.HashMap;
import java.util.Map;

// 스프링 시큐리티가 "/oauth2/authorization/kakao"로 리다이렉트를 만들 때 그 요청 URL을 커스터마이즈하는 곳.
// 기본 리졸버(defaultResolver)에게 표준 요청을 만들게 시키고, 그 결과를 두 가지만 손본다.
public class CustomOAuth2AuthorizationRequestResolver implements OAuth2AuthorizationRequestResolver {

    private final DefaultOAuth2AuthorizationRequestResolver defaultResolver;

    public CustomOAuth2AuthorizationRequestResolver(ClientRegistrationRepository clientRegistrationRepository) {
        this.defaultResolver = new DefaultOAuth2AuthorizationRequestResolver(
                clientRegistrationRepository, "/oauth2/authorization");
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
        return customize(request, defaultResolver.resolve(request));
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request, String clientRegistrationId) {
        return customize(request, defaultResolver.resolve(request, clientRegistrationId));
    }

    private OAuth2AuthorizationRequest customize(HttpServletRequest request, OAuth2AuthorizationRequest authorizationRequest) {
        if (authorizationRequest == null) return null;

        // 카카오는 PKCE를 지원하지 않아서, 스프링이 기본으로 붙이는 code_challenge 계열 파라미터를 빼버린다.
        // (안 빼면 카카오 인가 서버가 이 파라미터를 이해 못해 로그인이 깨질 수 있음)
        Map<String, Object> additionalParams = new HashMap<>(authorizationRequest.getAdditionalParameters());
        additionalParams.remove(PkceParameterNames.CODE_CHALLENGE);
        additionalParams.remove(PkceParameterNames.CODE_CHALLENGE_METHOD);

        // 프론트에서 로그아웃 후 재로그인 시 ?prompt_login=true를 붙여 보내면(Login.jsx의 kakao_force_login 플래그),
        // 카카오 쪽에 prompt=login을 전달해 "이미 로그인된 카카오 세션"으로 자동 통과되지 않고 로그인 화면을 다시 띄우게 한다.
        if ("true".equals(request.getParameter("prompt_login"))) {
            additionalParams.put("prompt", "login");
        }

        Map<String, Object> attributes = new HashMap<>(authorizationRequest.getAttributes());
        attributes.remove(PkceParameterNames.CODE_VERIFIER);

        return OAuth2AuthorizationRequest.from(authorizationRequest)
                .additionalParameters(additionalParams)
                .attributes(attributes)
                .build();
    }
}