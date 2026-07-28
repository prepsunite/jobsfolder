package com.prepunite.roadmap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapDto {
    private UUID id;
    private UUID companyId;
    private String companyName;
    private String companySlug;
    private String title;
    private String description;
    private Boolean isPublished;
    private List<RoadmapStepDto> steps;
    private LocalDateTime createdAt;
}
