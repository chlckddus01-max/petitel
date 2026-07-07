package com.petitel.backend.user.repository;

import com.petitel.backend.user.domain.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Optional;

// SQL 없는 계약 인터페이스. 같은 namespace의 mapper/UserMapper.xml에 있는 SQL과 이름으로 연결되고,
// MyBatis가 런타임에 구현체를 만들어 다른 빈(UserService 등)이 주입받아 쓸 수 있게 해준다.
@Mapper
public interface UserMapper {

    boolean existsByEmail(@Param("email") String email);

    boolean existsByPhone(@Param("phone") String phone);

    void insert(User user);

    Optional<User> findByProviderAndProviderId(@Param("provider") String provider,
                                                @Param("providerId") String providerId);

    Optional<User> findByEmail(@Param("email") String email);
}
