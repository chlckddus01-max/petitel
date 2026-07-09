package com.petitel.backend.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
public class ReviewCreateRequest {

    @NotNull(message = "예약을 선택해주세요.")
    private UUID reservationId;

    @NotNull(message = "별점을 선택해주세요.")
    @Min(value = 1, message = "별점은 1~5 사이여야 합니다.")
    @Max(value = 5, message = "별점은 1~5 사이여야 합니다.")
    private Integer rating;

    @Min(value = 1, message = "별점은 1~5 사이여야 합니다.")
    @Max(value = 5, message = "별점은 1~5 사이여야 합니다.")
    private Integer cleanlinessRating;

    @Min(value = 1, message = "별점은 1~5 사이여야 합니다.")
    @Max(value = 5, message = "별점은 1~5 사이여야 합니다.")
    private Integer kindnessRating;

    @NotNull(message = "리뷰 내용을 입력해주세요.")
    @Size(min = 10, max = 1000, message = "리뷰는 10자 이상 1000자 이하로 입력해주세요.")
    private String content;
}