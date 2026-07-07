package com.petitel.backend.global;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

// 모든 @RestController에 공통으로 적용되는 예외 처리기. 컨트롤러/서비스마다 try-catch를 안 써도
// 여기서 잡아 {"message": "..."} 형태의 400 응답으로 통일해준다. 프론트는 이 message를 그대로 화면에 띄운다.
@RestControllerAdvice
public class GlobalExceptionHandler {

    // UserService.signup()에서 던지는 "이미 가입된 이메일입니다" 같은 검증 실패가 여기로 온다.
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleIllegalArgument(IllegalArgumentException e) {
        return Map.of("message", e.getMessage());
    }

    // SignupRequest의 @NotBlank/@Email 같은 @Valid 검증이 실패하면(예: 이메일 형식 오류) 스프링이 던지는 예외.
    // 여러 필드가 동시에 틀려도 첫 번째 에러 메시지만 골라서 응답한다.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getDefaultMessage())
                .findFirst()
                .orElse("입력값이 올바르지 않습니다.");
        return Map.of("message", message);
    }
}