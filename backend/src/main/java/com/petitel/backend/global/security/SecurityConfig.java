package com.petitel.backend.global.security;

import com.petitel.backend.global.security.jwt.JwtAuthenticationFilter;
import com.petitel.backend.global.security.oauth2.CustomOAuth2UserService;
import com.petitel.backend.global.security.oauth2.HttpCookieOAuth2AuthorizationRequestRepository;
import com.petitel.backend.global.security.oauth2.OAuth2AuthenticationSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
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
                // IF_REQUIRED였을 때는 인증 성공 요청마다 JSESSIONID 세션이 만들어지고 거기에 로그인 상태가
                // 저장돼서, localStorage의 accessToken을 지우거나 깨뜨려도 세션 쿠키만으로 계속 인증이 유지되는
                // 문제가 있었다(JWT 기반 stateless 인증을 의도했는데 세션이 그걸 무력화). 카카오 인가요청 상태도
                // 이미 세션 대신 쿠키(HttpCookieOAuth2AuthorizationRequestRepository)로 저장하고 있으므로
                // 여기서도 세션을 아예 안 만들게 막아, 인증은 요청마다 JWT로만 판단하게 한다.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
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
                // oauth2Login()이 켜져 있으면 기본 진입점이 미인증 요청을 전부 카카오 로그인으로
                // 302 리다이렉트해버린다. /api/**는 fetch로 호출되는 API라 리다이렉트를 따라가다
                // CORS로 막혀버리므로(프론트에는 원인 불명 네트워크 에러로만 보임), /api/**만 401 JSON으로 응답하게 분리한다.
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .defaultAuthenticationEntryPointFor(apiAuthenticationEntryPoint(), PathPatternRequestMatcher.withDefaults().matcher("/api/**")))
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

    // /api/** 요청이 미인증 상태로 들어오면(토큰 없음/만료) 카카오 로그인으로 리다이렉트하지 않고
    // GlobalExceptionHandler와 같은 {"message": "..."} 형태의 401을 내려준다. 프론트는 이 상태코드로
    // "로그인 필요"를 판별해 로그인 페이지로 보낸다.
    @Bean
    public AuthenticationEntryPoint apiAuthenticationEntryPoint() {
        return (request, response, authException) -> {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"message\":\"로그인이 필요합니다.\"}");
        };
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