package com.petitel.backend.wishlist.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
public class WishlistCreateRequest {

    @NotNull(message = "호텔을 선택해주세요.")
    private UUID hotelId;
}