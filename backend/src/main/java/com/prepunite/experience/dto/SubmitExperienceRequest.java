package com.prepunite.experience.dto;

import com.prepunite.common.enums.QuestionDifficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitExperienceRequest {

    @NotNull(message = "Company ID is required")
    private UUID companyId;

    @NotBlank(message = "Role title is required")
    private String role;

    private String college;
    private Integer year;
    private QuestionDifficulty difficulty;

    @NotBlank(message = "Experience content is required")
    private String content;

    private String tips;
    private String resourcesUsed;
    private Boolean isAnonymous;
}
