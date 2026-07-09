package com.petitel.backend.review.domain;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

// 도메인 객체: reviews 테이블 한 행. 리뷰는 예약 1건당 정확히 하나만 존재해야 하므로
// (DB의 uq_reviews_reservation_id UNIQUE 제약과 짝을 이뤄) 생성 시점의 값만으로 완결되게 만든다.
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Review {

    private UUID id;
    private UUID reservationId;
    private UUID userId;
    private UUID hotelId;
    private int rating;
    private Integer cleanlinessRating;
    private Integer kindnessRating;
    private String content;
    private LocalDateTime createdAt;

    public Review(UUID reservationId, UUID userId, UUID hotelId, int rating,
                  Integer cleanlinessRating, Integer kindnessRating, String content) {
        this.id = UUID.randomUUID();
        this.reservationId = reservationId;
        this.userId = userId;
        this.hotelId = hotelId;
        this.rating = rating;
        this.cleanlinessRating = cleanlinessRating;
        this.kindnessRating = kindnessRating;
        this.content = content;
        this.createdAt = LocalDateTime.now();
    }
}