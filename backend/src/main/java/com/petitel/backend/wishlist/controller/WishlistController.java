package com.petitel.backend.wishlist.controller;

import com.petitel.backend.hotel.dto.HotelSummaryResponse;
import com.petitel.backend.wishlist.dto.WishlistCreateRequest;
import com.petitel.backend.wishlist.service.WishlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public List<HotelSummaryResponse> getMyWishlist(@AuthenticationPrincipal UUID userId) {
        return wishlistService.getMyWishlist(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void addWishlist(@AuthenticationPrincipal UUID userId, @Valid @RequestBody WishlistCreateRequest request) {
        wishlistService.addWishlist(userId, request);
    }

    @DeleteMapping("/{hotelId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeWishlist(@AuthenticationPrincipal UUID userId, @PathVariable UUID hotelId) {
        wishlistService.removeWishlist(userId, hotelId);
    }
}