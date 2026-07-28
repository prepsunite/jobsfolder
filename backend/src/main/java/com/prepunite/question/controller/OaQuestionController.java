package com.prepunite.question.controller;

import com.prepunite.common.enums.QuestionDifficulty;
import com.prepunite.common.enums.QuestionType;
import com.prepunite.question.dto.CreateQuestionRequest;
import com.prepunite.question.dto.OaQuestionDto;
import com.prepunite.question.service.OaQuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/v1/questions")
@RequiredArgsConstructor
public class OaQuestionController {

    private final OaQuestionService questionService;

    @GetMapping
    public ResponseEntity<Page<OaQuestionDto>> getQuestions(
            @RequestParam(required = false) UUID companyId,
            @RequestParam(required = false) QuestionDifficulty difficulty,
            @RequestParam(required = false) QuestionType questionType,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(questionService.getQuestions(companyId, difficulty, questionType, search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OaQuestionDto> getQuestionById(@PathVariable UUID id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @PostMapping
    public ResponseEntity<OaQuestionDto> createQuestion(@Valid @RequestBody CreateQuestionRequest request) {
        OaQuestionDto created = questionService.createQuestion(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable UUID id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
