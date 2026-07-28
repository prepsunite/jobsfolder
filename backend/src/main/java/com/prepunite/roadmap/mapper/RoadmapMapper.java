package com.prepunite.roadmap.mapper;

import com.prepunite.roadmap.dto.RoadmapDto;
import com.prepunite.roadmap.dto.RoadmapStepDto;
import com.prepunite.roadmap.entity.Roadmap;
import com.prepunite.roadmap.entity.RoadmapStep;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
public class RoadmapMapper {

    public RoadmapDto toDto(Roadmap roadmap) {
        if (roadmap == null) return null;

        return RoadmapDto.builder()
                .id(roadmap.getId())
                .companyId(roadmap.getCompany() != null ? roadmap.getCompany().getId() : null)
                .companyName(roadmap.getCompany() != null ? roadmap.getCompany().getName() : null)
                .companySlug(roadmap.getCompany() != null ? roadmap.getCompany().getSlug() : null)
                .title(roadmap.getTitle())
                .description(roadmap.getDescription())
                .isPublished(roadmap.getIsPublished())
                .steps(roadmap.getSteps() != null ?
                        roadmap.getSteps().stream().map(this::toStepDto).collect(Collectors.toList()) :
                        Collections.emptyList())
                .createdAt(roadmap.getCreatedAt())
                .build();
    }

    public RoadmapStepDto toStepDto(RoadmapStep step) {
        if (step == null) return null;

        return RoadmapStepDto.builder()
                .id(step.getId())
                .stepOrder(step.getStepOrder())
                .title(step.getTitle())
                .description(step.getDescription())
                .build();
    }
}
