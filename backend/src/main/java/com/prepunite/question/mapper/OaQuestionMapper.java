package com.prepunite.question.mapper;

import com.prepunite.question.dto.OaQuestionDto;
import com.prepunite.question.entity.OaQuestion;
import org.springframework.stereotype.Component;

@Component
public class OaQuestionMapper {

    public OaQuestionDto toDto(OaQuestion question) {
        if (question == null) return null;

        return OaQuestionDto.builder()
                .id(question.getId())
                .companyId(question.getCompany() != null ? question.getCompany().getId() : null)
                .companyName(question.getCompany() != null ? question.getCompany().getName() : null)
                .companySlug(question.getCompany() != null ? question.getCompany().getSlug() : null)
                .title(question.getTitle())
                .description(question.getDescription())
                .difficulty(question.getDifficulty())
                .questionType(question.getQuestionType())
                .solution(question.getSolution())
                .explanation(question.getExplanation())
                .frequency(question.getFrequency())
                .year(question.getYear())
                .isVerified(question.getIsVerified())
                .tags(question.getTags())
                .createdAt(question.getCreatedAt())
                .build();
    }
}
