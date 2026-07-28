package com.prepunite.admin.service;

import com.prepunite.admin.dto.AdminDashboardDto;
import com.prepunite.auth.repository.UserRepository;
import com.prepunite.common.enums.ExperienceStatus;
import com.prepunite.company.repository.CompanyRepository;
import com.prepunite.experience.dto.InterviewExperienceDto;
import com.prepunite.experience.entity.InterviewExperience;
import com.prepunite.experience.mapper.InterviewExperienceMapper;
import com.prepunite.experience.repository.InterviewExperienceRepository;
import com.prepunite.question.repository.OaQuestionRepository;
import com.prepunite.resource.repository.ResourceRepository;
import com.prepunite.roadmap.repository.RoadmapRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final OaQuestionRepository questionRepository;
    private final InterviewExperienceRepository experienceRepository;
    private final ResourceRepository resourceRepository;
    private final RoadmapRepository roadmapRepository;
    private final InterviewExperienceMapper experienceMapper;

    @Transactional(readOnly = true)
    public AdminDashboardDto getDashboardStats() {
        return AdminDashboardDto.builder()
                .totalUsers(userRepository.count())
                .totalCompanies(companyRepository.count())
                .totalQuestions(questionRepository.count())
                .totalExperiences(experienceRepository.count())
                .pendingApprovals(experienceRepository.findByStatus(ExperienceStatus.PENDING, Pageable.unpaged()).getTotalElements())
                .totalResources(resourceRepository.count())
                .totalRoadmaps(roadmapRepository.count())
                .build();
    }

    @Transactional(readOnly = true)
    public Page<InterviewExperienceDto> getPendingExperiences(Pageable pageable) {
        return experienceRepository.findByStatus(ExperienceStatus.PENDING, pageable)
                .map(experienceMapper::toDto);
    }
}
