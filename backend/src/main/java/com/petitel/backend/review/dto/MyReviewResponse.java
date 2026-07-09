package com.petitel.backend.review.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class MyReviewResponse {
    private UUID id;
    private UUID hotelId;
    private String hotelName;
    private int rating;
    private Integer cleanlinessRating;
    private Integer kindnessRating;
    private String content;
    private LocalDateTime createdAt;
}