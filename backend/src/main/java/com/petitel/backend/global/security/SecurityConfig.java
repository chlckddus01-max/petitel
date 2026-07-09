package com.petitel.backend.global.security;

import com.petitel.backend.global.security.jwt.JwtAuthenticationFilter;
import com.petitel.backend.global.security.oauth2.CustomOAuth2UserService;
import com.petitel.backend.global.security.oauth2.HttpCookieOAuth2AuthorizationRequestRepository;
import com.petitel.backend.global.security.oauth2.OAuth2AuthenticationSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.http.HttpMethod;
import com.petitel.backend.global.security.oauth2.CustomOAuth2AuthorizationRequestResolver;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

// 보안 설정의 중심. 어떤 경로가 인증 없이 열려있는지, 카카오 OAuth2 로그인 흐름을 어떤 빈들이
// 처리하는지, JWT 필터를 어디에 끼워넣는지를 여기서 전부 배선(wiring)한다.
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final ClientRegistrationRepository clientRegistrationRepository;
    private final HttpCookieOAuth2AuthorizationRequestRepository cookieAuthorizationRequestRepository;

    // 배포 환경에서는 CORS_ALLOWED_ORIGINS 환경변수로 실제 프론트 도메인을 넣는다. 여러 개면 콤마로 구분.
    @Value("${cors.allowed-origins:http://localhost:5173}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()))
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth -> auth
                        // 회원가입, 이메일 로그인, 카카오 OAuth2 진입/콜백, 호텔 탐색 경로만 로그인 없이 접근 가능. 나머지는 전부 인증 필요.
                        .requestMatchers(
                                "/api/users/signup",
                                "/api/auth/login",
                                "/oauth2/**",
                                "/login/oauth2/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/hotels/**").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        // 카카오 인가 요청을 커스터마이즈(prompt=login 등)하는 리졸버 + 요청 상태를
                        // 서버 세션 대신 쿠키에 저장하는 리포지토리(배포 환경 세션 유실 문제 회피).
                        .authorizationEndpoint(authorization -> authorization
                                .authorizationRequestResolver(authorizationRequestResolver())
                                .authorizationRequestRepository(cookieAuthorizationRequestRepository))
                        // 카카오에서 받은 프로필로 유저 조회/생성하는 서비스.
                        .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                        // 로그인 성공 시 JWT를 만들어 프론트로 리다이렉트하는 핸들러.
                        .successHandler(oAuth2AuthenticationSuccessHandler)
                )
                // 매 요청마다 Authorization 헤더의 JWT를 검사해 SecurityContext에 인증 정보를 채워주는 필터.
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private OAuth2AuthorizationRequestResolver authorizationRequestResolver() {
        return new CustomOAuth2AuthorizationRequestResolver(clientRegistrationRepository);
    }

    // 비밀번호 해시/검증에 쓰는 빈. UserService가 가입 시 encode(), 로그인 시 matches()로 사용한다.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // cors.allowed-origins(기본값 localhost:5173)에서 오는 요청만 자격증명(쿠키/헤더) 포함해서 허용.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}