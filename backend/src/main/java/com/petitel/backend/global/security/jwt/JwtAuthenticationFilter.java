package com.petitel.backend.global.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.UUID;

// SecurityConfig에서 매 요청마다 실행되도록 끼워넣은 필터(OncePerRequestFilter라 요청당 정확히 한 번만 실행).
// Authorization 헤더의 "Bearer {jwt}"를 읽어 유효하면 SecurityContext에 로그인 상태를 채워준다.
// 토큰이 없거나 유효하지 않아도 그냥 인증 없이 다음 필터로 넘긴다 — 실제 차단은 SecurityConfig의
// .anyRequest().authenticated()가 담당.
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = resolveToken(request);

        if (token != null && jwtProvider.isValid(token)) {
            // principal 자리에 userId(UUID)를 그대로 넣어둔다 — 컨트롤러에서 필요하면 인증 객체에서 꺼내 쓸 수 있음.
            UUID userId = jwtProvider.getUserId(token);
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userId, null,
                            Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    // "Authorization: Bearer xxx" 헤더에서 xxx 부분만 잘라낸다.
    private String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (bearer != null && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }
}