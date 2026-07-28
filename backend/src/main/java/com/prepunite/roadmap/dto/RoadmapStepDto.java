package com.prepunite.roadmap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapStepDto {
    private UUID id;
    private Integer stepOrder;
    private String title;
    private String description;
}
