package com.petitel.backend.review.service;

import com.petitel.backend.review.domain.Review;
import com.petitel.backend.review.dto.MyReviewResponse;
import com.petitel.backend.review.dto.ReviewCreateRequest;
import com.petitel.backend.review.repository.ReviewMapper;
import com.petitel.backend.reservation.repository.ReservationMapper;
import com.petitel.backend.reservation.repository.ReservationOwnershipRow;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewMapper reviewMapper;
    private final ReservationMapper reservationMapper;

    @Transactional
    public void createReview(UUID userId, ReviewCreateRequest request) {
        ReservationOwnershipRow reservation = reservationMapper
                .findByIdAndUserId(request.getReservationId(), userId)
                .orElseThrow(() -> new IllegalArgumentException("본인의 예약만 리뷰를 작성할 수 있습니다."));

        // 설계서 정의: "이용완료" = CONFIRMED 상태이면서 체크아웃일이 지난 예약만 리뷰 작성 가능.
        boolean isCompleted = "CONFIRMED".equals(reservation.getStatus())
                && reservation.getCheckOut().isBefore(LocalDate.now());
        if (!isCompleted) {
            throw new IllegalArgumentException("이용이 완료된 예약만 리뷰를 작성할 수 있습니다.");
        }

        if (reviewMapper.existsByReservationId(reservation.getId())) {
            throw new IllegalArgumentException("이미 리뷰를 작성한 예약입니다.");
        }

        Review review = new Review(
                reservation.getId(),
                userId,
                reservation.getHotelId(),
                request.getRating(),
                request.getCleanlinessRating(),
                request.getKindnessRating(),
                request.getContent()
        );
        reviewMapper.insert(review);
    }

    public List<MyReviewResponse> getMyReviews(UUID userId) {
        return reviewMapper.findByUserId(userId);
    }
}