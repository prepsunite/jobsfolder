package com.prepunite.question.repository;

import com.prepunite.common.enums.QuestionDifficulty;
import com.prepunite.common.enums.QuestionType;
import com.prepunite.question.entity.OaQuestion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OaQuestionRepository extends JpaRepository<OaQuestion, UUID> {

    @Query("SELECT q FROM OaQuestion q WHERE " +
           "(:companyId IS NULL OR q.company.id = :companyId) AND " +
           "(:difficulty IS NULL OR q.difficulty = :difficulty) AND " +
           "(:questionType IS NULL OR q.questionType = :questionType) AND " +
           "(:search IS NULL OR LOWER(q.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(q.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<OaQuestion> filterQuestions(
            @Param("companyId") UUID companyId,
            @Param("difficulty") QuestionDifficulty difficulty,
            @Param("questionType") QuestionType questionType,
            @Param("search") String search,
            Pageable pageable
    );
}
