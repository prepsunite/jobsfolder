package com.prepunite.question.service;

import com.prepunite.common.enums.QuestionDifficulty;
import com.prepunite.common.enums.QuestionType;
import com.prepunite.company.entity.Company;
import com.prepunite.company.repository.CompanyRepository;
import com.prepunite.exception.EntityNotFoundException;
import com.prepunite.question.dto.CreateQuestionRequest;
import com.prepunite.question.dto.OaQuestionDto;
import com.prepunite.question.entity.OaQuestion;
import com.prepunite.question.mapper.OaQuestionMapper;
import com.prepunite.question.repository.OaQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OaQuestionService {

    private final OaQuestionRepository questionRepository;
    private final CompanyRepository companyRepository;
    private final OaQuestionMapper questionMapper;

    @Transactional(readOnly = true)
    public Page<OaQuestionDto> getQuestions(
            UUID companyId,
            QuestionDifficulty difficulty,
            QuestionType questionType,
            String search,
            Pageable pageable
    ) {
        return questionRepository.filterQuestions(companyId, difficulty, questionType, search, pageable)
                .map(questionMapper::toDto);
    }

    @Transactional(readOnly = true)
    public OaQuestionDto getQuestionById(UUID id) {
        OaQuestion question = questionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + id));
        return questionMapper.toDto(question);
    }

    @Transactional
    public OaQuestionDto createQuestion(CreateQuestionRequest request) {
        Company company = null;
        if (request.getCompanyId() != null) {
            company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new EntityNotFoundException("Company not found with id: " + request.getCompanyId()));
        }

        OaQuestion question = OaQuestion.builder()
                .company(company)
                .title(request.getTitle())
                .description(request.getDescription())
                .difficulty(request.getDifficulty())
                .questionType(request.getQuestionType())
                .solution(request.getSolution())
                .explanation(request.getExplanation())
                .year(request.getYear())
                .tags(request.getTags() != null ? request.getTags() : java.util.Collections.emptySet())
                .frequency(1)
                .isVerified(true)
                .build();

        OaQuestion saved = questionRepository.save(question);
        return questionMapper.toDto(saved);
    }

    @Transactional
    public void deleteQuestion(UUID id) {
        if (!questionRepository.existsById(id)) {
            throw new EntityNotFoundException("Question not found with id: " + id);
        }
        questionRepository.deleteById(id);
    }
}
