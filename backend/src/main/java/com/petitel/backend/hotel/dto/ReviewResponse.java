package com.petitel.backend.hotel.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

// reviewerName은 매퍼 SQL에서 이미 "김*지" 형태로 마스킹해서 내려준다.
@Getter
@AllArgsConstructor
public class ReviewResponse {
    private String reviewerName;
    private int rating;
    private String content;
}
