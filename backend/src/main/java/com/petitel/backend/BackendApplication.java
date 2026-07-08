package com.petitel.backend;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// 앱 진입점. @SpringBootApplication이 컴포넌트 스캔/자동설정/설정파일 로딩을 다 트리거한다.
// @MapperScan은 하위 패키지를 통째로 훑어서 @Mapper 인터페이스(UserMapper, HotelMapper 등)를 찾아
// MyBatis가 런타임에 구현체(프록시)를 만들어 스프링 빈으로 등록하게 지정하는 것.
@SpringBootApplication
@MapperScan("com.petitel.backend")
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
