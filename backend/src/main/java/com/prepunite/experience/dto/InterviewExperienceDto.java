package com.prepunite.experience.dto;

import com.prepunite.common.enums.ExperienceStatus;
import com.prepunite.common.enums.QuestionDifficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewExperienceDto {
    private UUID id;
    private UUID companyId;
    private String companyName;
    private String companySlug;
    private String authorName;
    private String role;
    private String college;
    private Integer year;
    private QuestionDifficulty difficulty;
    private String content;
    private String tips;
    private String resourcesUsed;
    private ExperienceStatus status;
    private Boolean isAnonymous;
    private Integer viewCount;
    private LocalDateTime createdAt;
}
