package com.prepunite.experience.service;

import com.prepunite.auth.entity.User;
import com.prepunite.auth.repository.UserRepository;
import com.prepunite.common.enums.ExperienceStatus;
import com.prepunite.company.entity.Company;
import com.prepunite.company.repository.CompanyRepository;
import com.prepunite.exception.EntityNotFoundException;
import com.prepunite.experience.dto.InterviewExperienceDto;
import com.prepunite.experience.dto.SubmitExperienceRequest;
import com.prepunite.experience.entity.InterviewExperience;
import com.prepunite.experience.mapper.InterviewExperienceMapper;
import com.prepunite.experience.repository.InterviewExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InterviewExperienceService {

    private final InterviewExperienceRepository experienceRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final InterviewExperienceMapper experienceMapper;

    @Transactional(readOnly = true)
    public Page<InterviewExperienceDto> getApprovedExperiences(UUID companyId, String search, Pageable pageable) {
        return experienceRepository.filterApprovedExperiences(companyId, search, pageable)
                .map(experienceMapper::toDto);
    }

    @Transactional(readOnly = true)
    public InterviewExperienceDto getExperienceById(UUID id) {
        InterviewExperience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Experience not found with id: " + id));

        // Increment view count
        experience.setViewCount(experience.getViewCount() + 1);
        experienceRepository.save(experience);

        return experienceMapper.toDto(experience);
    }

    @Transactional
    public InterviewExperienceDto submitExperience(SubmitExperienceRequest request) {
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new EntityNotFoundException("Company not found with id: " + request.getCompanyId()));

        // System user fallback for unauthenticated MVP initial demo submissions
        User user = userRepository.findAll().stream().findFirst()
                .orElseGet(() -> userRepository.save(User.builder()
                        .clerkId("clerk_demo_user")
                        .email("student@prepunite.com")
                        .username("student")
                        .firstName("Student")
                        .lastName("User")
                        .build()));

        InterviewExperience experience = InterviewExperience.builder()
                .user(user)
                .company(company)
                .role(request.getRole())
                .college(request.getCollege())
                .year(request.getYear())
                .difficulty(request.getDifficulty())
                .content(request.getContent())
                .tips(request.getTips())
                .resourcesUsed(request.getResourcesUsed())
                .isAnonymous(Boolean.TRUE.equals(request.getIsAnonymous()))
                .status(ExperienceStatus.APPROVED) // Auto-approve for instant MVP testing
                .build();

        InterviewExperience saved = experienceRepository.save(experience);
        return experienceMapper.toDto(saved);
    }

    @Transactional
    public InterviewExperienceDto moderateExperience(UUID id, ExperienceStatus status, String rejectionReason) {
        InterviewExperience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Experience not found with id: " + id));

        experience.setStatus(status);
        if (rejectionReason != null) {
            experience.setRejectionReason(rejectionReason);
        }

        InterviewExperience updated = experienceRepository.save(experience);
        return experienceMapper.toDto(updated);
    }
}
