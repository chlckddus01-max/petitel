package com.petitel.backend.global.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import javax.sql.DataSource;

// MyBatis를 스프링 빈으로 등록하는 배선 코드. resources/mapper/*.xml 파일들을 찾아 로딩하고,
// UUID 컬럼을 읽고 쓸 수 있게 커스텀 타입핸들러를 등록한다.
@Configuration
public class MyBatisConfig {

    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dataSource);
        // classpath의 mapper 디렉터리 밑 모든 XML을 매퍼 SQL로 등록.
        factoryBean.setMapperLocations(
                new PathMatchingResourcePatternResolver().getResources("classpath:mapper/**/*.xml"));
        // MyBatis는 UUID 타입을 기본 지원하지 않아서(등록 안 해두면 부팅 시 "No typehandler found" 에러 발생),
        // users.id 같은 UUID 컬럼을 다루기 위해 직접 만든 핸들러를 등록.
        factoryBean.setTypeHandlers(new UuidTypeHandler());
        // DB 컬럼(snake_case) <-> 엔티티 필드(camelCase) 자동 매핑 규칙. resultMap을 안 쓰는 매퍼에서도 이 규칙이 적용됨.
        factoryBean.getObject().getConfiguration().setMapUnderscoreToCamelCase(true);
        return factoryBean.getObject();
    }

    @Bean
    public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}