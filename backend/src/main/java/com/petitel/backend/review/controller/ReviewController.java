package com.petitel.backend.review.controller;

import com.petitel.backend.review.dto.MyReviewResponse;
import com.petitel.backend.review.dto.ReviewCreateRequest;
import com.petitel.backend.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createReview(@AuthenticationPrincipal UUID userId, @Valid @RequestBody ReviewCreateRequest request) {
        reviewService.createReview(userId, request);
    }

    @GetMapping("/mine")
    public List<MyReviewResponse> getMyReviews(@AuthenticationPrincipal UUID userId) {
        return reviewService.getMyReviews(userId);
    }
}