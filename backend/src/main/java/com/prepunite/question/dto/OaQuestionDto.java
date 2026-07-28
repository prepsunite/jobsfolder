package com.prepunite.question.dto;

import com.prepunite.common.enums.QuestionDifficulty;
import com.prepunite.common.enums.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OaQuestionDto {
    private UUID id;
    private UUID companyId;
    private String companyName;
    private String companySlug;
    private String title;
    private String description;
    private QuestionDifficulty difficulty;
    private QuestionType questionType;
    private String solution;
    private String explanation;
    private Integer frequency;
    private Integer year;
    private Boolean isVerified;
    private Set<String> tags;
    private LocalDateTime createdAt;
}
