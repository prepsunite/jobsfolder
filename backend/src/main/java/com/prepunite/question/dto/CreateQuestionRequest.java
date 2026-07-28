package com.prepunite.question.dto;

import com.prepunite.common.enums.QuestionDifficulty;
import com.prepunite.common.enums.QuestionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateQuestionRequest {

    private UUID companyId;

    @NotBlank(message = "Question title is required")
    private String title;

    private String description;

    @NotNull(message = "Difficulty is required")
    private QuestionDifficulty difficulty;

    @NotNull(message = "Question type is required")
    private QuestionType questionType;

    private String solution;
    private String explanation;
    private Integer year;
    private Set<String> tags;
}
