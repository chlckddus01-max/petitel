package com.petitel.backend.reservation.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@NoArgsConstructor
public class ReservationCreateRequest {

    @NotNull(message = "객실을 선택해주세요.")
    private UUID roomId;

    @NotNull(message = "체크인 날짜는 필수입니다.")
    @FutureOrPresent(message = "체크인 날짜는 오늘 이후여야 합니다.")
    private LocalDate checkIn;

    @NotNull(message = "체크아웃 날짜는 필수입니다.")
    private LocalDate checkOut;

    @NotEmpty(message = "반려동물을 1마리 이상 선택해주세요.")
    private List<UUID> petIds;

    @Size(max = 500, message = "요청사항은 500자 이하로 입력해주세요.")
    private String requestNote;
}
