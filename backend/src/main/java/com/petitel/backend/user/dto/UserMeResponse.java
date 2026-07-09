package com.petitel.backend.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class UserMeResponse {
    private UUID id;
    private String email;
    private String name;
    private String phone;
    private String provider;
    private boolean marketingAgreed;
}