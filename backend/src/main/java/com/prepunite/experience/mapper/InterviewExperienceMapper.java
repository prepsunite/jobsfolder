package com.prepunite.experience.mapper;

import com.prepunite.experience.dto.InterviewExperienceDto;
import com.prepunite.experience.entity.InterviewExperience;
import org.springframework.stereotype.Component;

@Component
public class InterviewExperienceMapper {

    public InterviewExperienceDto toDto(InterviewExperience experience) {
        if (experience == null) return null;

        String authorName = "Anonymous Student";
        if (Boolean.FALSE.equals(experience.getIsAnonymous()) && experience.getUser() != null) {
            authorName = experience.getUser().getFirstName() != null ?
                    experience.getUser().getFirstName() + " " + (experience.getUser().getLastName() != null ? experience.getUser().getLastName() : "") :
                    experience.getUser().getUsername();
        }

        return InterviewExperienceDto.builder()
                .id(experience.getId())
                .companyId(experience.getCompany() != null ? experience.getCompany().getId() : null)
                .companyName(experience.getCompany() != null ? experience.getCompany().getName() : null)
                .companySlug(experience.getCompany() != null ? experience.getCompany().getSlug() : null)
                .authorName(authorName)
                .role(experience.getRole())
                .college(experience.getCollege())
                .year(experience.getYear())
                .difficulty(experience.getDifficulty())
                .content(experience.getContent())
                .tips(experience.getTips())
                .resourcesUsed(experience.getResourcesUsed())
                .status(experience.getStatus())
                .isAnonymous(experience.getIsAnonymous())
                .viewCount(experience.getViewCount())
                .createdAt(experience.getCreatedAt())
                .build();
    }
}
