package com.petitel.backend.review.repository;

import com.petitel.backend.review.domain.Review;
import com.petitel.backend.review.dto.MyReviewResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.UUID;

@Mapper
public interface ReviewMapper {

    boolean existsByReservationId(@Param("reservationId") UUID reservationId);

    void insert(Review review);

    List<MyReviewResponse> findByUserId(@Param("userId") UUID userId);

    // 예약 목록 화면에서 "리뷰 작성하기" vs "내 리뷰 보기" 버튼 문구를 정하기 위해,
    // 이 사용자가 이미 리뷰를 쓴 예약id 목록만 가볍게 받아온다.
    List<UUID> findReviewedReservationIdsByUserId(@Param("userId") UUID userId);
}