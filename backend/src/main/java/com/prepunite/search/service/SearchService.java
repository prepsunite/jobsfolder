package com.prepunite.search.service;

import com.prepunite.company.service.CompanyService;
import com.prepunite.experience.service.InterviewExperienceService;
import com.prepunite.question.service.OaQuestionService;
import com.prepunite.resource.service.ResourceService;
import com.prepunite.roadmap.service.RoadmapService;
import com.prepunite.search.dto.GlobalSearchDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final CompanyService companyService;
    private final OaQuestionService questionService;
    private final InterviewExperienceService experienceService;
    private final ResourceService resourceService;
    private final RoadmapService roadmapService;

    @Transactional(readOnly = true)
    public GlobalSearchDto search(String query) {
        if (query == null || query.isBlank()) {
            return GlobalSearchDto.builder()
                    .query("")
                    .companies(java.util.Collections.emptyList())
                    .questions(java.util.Collections.emptyList())
                    .experiences(java.util.Collections.emptyList())
                    .resources(java.util.Collections.emptyList())
                    .roadmaps(java.util.Collections.emptyList())
                    .build();
        }

        String q = query.trim();
        PageRequest limit = PageRequest.of(0, 5);

        return GlobalSearchDto.builder()
                .query(q)
                .companies(companyService.getCompanies(q, limit).getContent())
                .questions(questionService.getQuestions(null, null, null, q, limit).getContent())
                .experiences(experienceService.getApprovedExperiences(null, q, limit).getContent())
                .resources(resourceService.getResources(null, q, limit).getContent())
                .roadmaps(roadmapService.getPublishedRoadmaps(limit).getContent())
                .build();
    }
}
