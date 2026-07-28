package com.prepunite.search.dto;

import com.prepunite.company.dto.CompanyDto;
import com.prepunite.experience.dto.InterviewExperienceDto;
import com.prepunite.question.dto.OaQuestionDto;
import com.prepunite.resource.dto.ResourceDto;
import com.prepunite.roadmap.dto.RoadmapDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlobalSearchDto {
    private String query;
    private List<CompanyDto> companies;
    private List<OaQuestionDto> questions;
    private List<InterviewExperienceDto> experiences;
    private List<ResourceDto> resources;
    private List<RoadmapDto> roadmaps;
}
