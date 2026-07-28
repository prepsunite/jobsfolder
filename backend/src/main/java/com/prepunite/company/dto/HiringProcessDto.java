package com.prepunite.company.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HiringProcessDto {
    private UUID id;
    private Integer roundNumber;
    private String roundType;
    private String title;
    private String description;
    private Integer durationMinutes;
    private String tips;
}
