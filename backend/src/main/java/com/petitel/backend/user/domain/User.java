package com.petitel.backend.user.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(length = 100)
    private String password;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(length = 20)
    private String phone;

    @Column(length = 20)
    private String provider;

    @Column(length = 100)
    private String providerId;

    @Column(nullable = false)
    private boolean termsAgreed;

    @Column(nullable = false)
    private boolean privacyAgreed;

    @Column(nullable = false)
    private boolean marketingAgreed;

    @Column(nullable = false)
    private LocalDateTime agreedAt;

    public User(String email, String password, String name, String phone,
                boolean termsAgreed, boolean privacyAgreed, boolean marketingAgreed) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.phone = phone;
        this.provider = "LOCAL";
        this.termsAgreed = termsAgreed;
        this.privacyAgreed = privacyAgreed;
        this.marketingAgreed = marketingAgreed;
        this.agreedAt = LocalDateTime.now();
    }

    public User(String email, String name, String provider, String providerId) {
        this.email = email;
        this.name = name;
        this.provider = provider;
        this.providerId = providerId;
        this.termsAgreed = true;
        this.privacyAgreed = true;
        this.marketingAgreed = false;
        this.agreedAt = LocalDateTime.now();
    }
}