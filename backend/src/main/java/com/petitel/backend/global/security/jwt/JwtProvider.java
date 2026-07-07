package com.petitel.backend.global.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

// JWT를 발급하고(createToken) 검증/해석하는(parseToken, isValid, getUserId) 유일한 곳.
// 로그인 성공 시(OAuth2AuthenticationSuccessHandler)와, 이후 매 요청 인증 시(JwtAuthenticationFilter) 둘 다 이걸 쓴다.
@Component
public class JwtProvider {

    // application.yml의 jwt.secret. 토큰 서명/검증에 쓰는 비밀키 문자열.
    @Value("${jwt.secret}")
    private String secret;

    // application.yml의 jwt.expiration(ms). 토큰 만료 시간.
    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // 로그인 성공 시 호출. userId를 subject(sub)로, email/name을 커스텀 claim으로 담아 서명한 토큰 문자열을 만든다.
    public String createToken(UUID userId, String email, String name) {
        Date now = new Date();
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("email", email)
                .claim("name", name)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    // 서명 검증 + 만료 확인까지 포함해서 토큰을 해석. 서명이 다르거나 만료됐으면 예외를 던진다.
    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // JwtAuthenticationFilter가 요청마다 부르는 통과/거절 판단용. 예외를 잡아 boolean으로 뒤집어준다.
    public boolean isValid(String token) {
        try {
            parseToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // subject에 넣어둔 사용자 UUID를 다시 꺼낸다.
    public UUID getUserId(String token) {
        return UUID.fromString(parseToken(token).getSubject());
    }
}