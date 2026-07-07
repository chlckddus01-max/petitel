package com.petitel.backend.global.config;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

// PostgreSQL의 uuid 컬럼 <-> Java UUID 타입 변환기. PostgreSQL JDBC 드라이버가 setObject/getObject로
// UUID를 네이티브로 주고받을 수 있어서 그대로 위임하기만 하면 된다. MyBatisConfig에서 등록해서 쓴다.
@MappedTypes(UUID.class)
public class UuidTypeHandler extends BaseTypeHandler<UUID> {

    // INSERT 등에서 파라미터로 UUID를 바인딩할 때.
    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, UUID parameter, JdbcType jdbcType) throws SQLException {
        ps.setObject(i, parameter);
    }

    // SELECT 결과에서 컬럼명으로 UUID를 꺼낼 때 (resultMap에서 주로 이 경로).
    @Override
    public UUID getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return (UUID) rs.getObject(columnName);
    }

    // SELECT 결과에서 컬럼 순번으로 꺼낼 때.
    @Override
    public UUID getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return (UUID) rs.getObject(columnIndex);
    }

    // 저장 프로시저 OUT 파라미터로 꺼낼 때 (이 프로젝트에서는 안 쓰지만 인터페이스상 구현 필수).
    @Override
    public UUID getNullableResult(java.sql.CallableStatement cs, int columnIndex) throws SQLException {
        return (UUID) cs.getObject(columnIndex);
    }
}
