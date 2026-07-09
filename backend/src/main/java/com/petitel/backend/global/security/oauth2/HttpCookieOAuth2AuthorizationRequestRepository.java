package com.petitel.backend.global.security.oauth2;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.SerializationUtils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.Base64;
import java.util.Optional;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

// 카카오로 리다이렉트했다가 돌아오는 짧은 순간의 OAuth2AuthorizationRequest를 서버 세션(HttpSession)이
// 아니라 쿠키에 직접 저장한다. Railway 배포에서 두 요청이 세션을 공유 못 하거나(다중 인스턴스),
// 세션 쿠키의 Secure/SameSite 조합이 플랫폼 프록시와 안 맞아 계속 "authorization_request_not_found"로
// 실패해서, 서버 상태에 아예 의존하지 않는 방식으로 바꿨다.
@Component
public class HttpCookieOAuth2AuthorizationRequestRepository
        implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {

    private static final Logger log = LoggerFactory.getLogger(HttpCookieOAuth2AuthorizationRequestRepository.class);

    private static final String COOKIE_NAME = "oauth2_auth_request";
    private static final int COOKIE_EXPIRE_SECONDS = 180;

    // 세션 쿠키와 동일한 기준으로 Secure 여부를 맞춘다 (로컬 http는 false, 배포 https는 true).
    @Value("${server.servlet.session.cookie.secure:false}")
    private boolean secure;

    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        // 원인 파악용 임시 로그: 이 요청에 실제로 어떤 쿠키가 들어왔는지, 우리 쿠키를 찾았는지 그대로 남긴다.
        String cookieNames = request.getCookies() == null
                ? "(no cookies at all)"
                : Arrays.toString(Arrays.stream(request.getCookies()).map(Cookie::getName).toArray());
        log.info("[oauth2-debug] loadAuthorizationRequest uri={} incoming cookies={}", request.getRequestURI(), cookieNames);

        Optional<Cookie> cookie = getCookie(request);
        if (cookie.isEmpty()) {
            log.info("[oauth2-debug] {} cookie NOT found", COOKIE_NAME);
            return null;
        }
        try {
            OAuth2AuthorizationRequest result = deserialize(cookie.get());
            log.info("[oauth2-debug] {} cookie found and deserialized OK", COOKIE_NAME);
            return result;
        } catch (Exception e) {
            log.error("[oauth2-debug] failed to deserialize {} cookie", COOKIE_NAME, e);
            return null;
        }
    }

    @Override
    public void saveAuthorizationRequest(OAuth2AuthorizationRequest authorizationRequest,
                                          HttpServletRequest request, HttpServletResponse response) {
        if (authorizationRequest == null) {
            log.info("[oauth2-debug] saveAuthorizationRequest called with null -> deleting cookie");
            deleteCookie(request, response);
            return;
        }
        String value = serialize(authorizationRequest);
        log.info("[oauth2-debug] saveAuthorizationRequest uri={} cookieValueLength={}", request.getRequestURI(), value.length());
        addCookie(response, value);
    }

    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(HttpServletRequest request, HttpServletResponse response) {
        log.info("[oauth2-debug] removeAuthorizationRequest uri={}", request.getRequestURI());
        OAuth2AuthorizationRequest authorizationRequest = loadAuthorizationRequest(request);
        deleteCookie(request, response);
        return authorizationRequest;
    }

    private Optional<Cookie> getCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return Optional.empty();
        for (Cookie cookie : request.getCookies()) {
            if (COOKIE_NAME.equals(cookie.getName())) {
                return Optional.of(cookie);
            }
        }
        return Optional.empty();
    }

    private void addCookie(HttpServletResponse response, String value) {
        Cookie cookie = new Cookie(COOKIE_NAME, value);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(secure);
        cookie.setMaxAge(COOKIE_EXPIRE_SECONDS);
        // SameSite를 명시 안 하면 브라우저 기본값에 맡겨지는데, 세션 쿠키(JSESSIONID)는
        // server.servlet.session.cookie.same-site로 명시적으로 Lax가 찍혀서 정상 도착하는 반면
        // 이 쿠키는 명시가 없어 카카오 콜백(리다이렉트로 돌아오는 요청)에서 계속 누락됐다. 직접 못박는다.
        cookie.setAttribute("SameSite", "Lax");
        response.addCookie(cookie);
    }

    private void deleteCookie(HttpServletRequest request, HttpServletResponse response) {
        getCookie(request).ifPresent(cookie -> {
            cookie.setValue("");
            cookie.setPath("/");
            cookie.setMaxAge(0);
            response.addCookie(cookie);
        });
    }

    // 직렬화한 OAuth2AuthorizationRequest는 2.5KB가 넘어가는데(중복 필드가 많음), 배포 환경 프록시가
    // 이 정도로 큰 Set-Cookie 헤더를 조용히 잘라내거나 버리는 것으로 확인돼서 gzip으로 압축해 크기를 줄인다.
    private String serialize(OAuth2AuthorizationRequest authorizationRequest) {
        byte[] raw = SerializationUtils.serialize(authorizationRequest);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(gzip(raw));
    }

    private OAuth2AuthorizationRequest deserialize(Cookie cookie) {
        byte[] compressed = Base64.getUrlDecoder().decode(cookie.getValue());
        return (OAuth2AuthorizationRequest) SerializationUtils.deserialize(gunzip(compressed));
    }

    private byte[] gzip(byte[] data) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (GZIPOutputStream gzos = new GZIPOutputStream(baos)) {
            gzos.write(data);
        } catch (IOException e) {
            throw new IllegalStateException("OAuth2AuthorizationRequest 압축 실패", e);
        }
        return baos.toByteArray();
    }

    private byte[] gunzip(byte[] data) {
        try (GZIPInputStream gzis = new GZIPInputStream(new ByteArrayInputStream(data))) {
            return gzis.readAllBytes();
        } catch (IOException e) {
            throw new IllegalStateException("OAuth2AuthorizationRequest 압축 해제 실패", e);
        }
    }
}
