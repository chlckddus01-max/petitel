package com.petitel.backend.global.security.oauth2;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.oauth2.core.endpoint.PkceParameterNames;

import java.util.HashMap;
import java.util.Map;

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

        Map<String, Object> additionalParams = new HashMap<>(authorizationRequest.getAdditionalParameters());
        additionalParams.remove(PkceParameterNames.CODE_CHALLENGE);
        additionalParams.remove(PkceParameterNames.CODE_CHALLENGE_METHOD);

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