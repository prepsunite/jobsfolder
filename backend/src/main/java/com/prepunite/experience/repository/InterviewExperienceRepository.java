package com.prepunite.experience.repository;

import com.prepunite.common.enums.ExperienceStatus;
import com.prepunite.experience.entity.InterviewExperience;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface InterviewExperienceRepository extends JpaRepository<InterviewExperience, UUID> {

    Page<InterviewExperience> findByStatus(ExperienceStatus status, Pageable pageable);

    @Query("SELECT e FROM InterviewExperience e WHERE e.status = 'APPROVED' AND " +
           "(:companyId IS NULL OR e.company.id = :companyId) AND " +
           "(:search IS NULL OR LOWER(e.role) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.content) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<InterviewExperience> filterApprovedExperiences(
            @Param("companyId") UUID companyId,
            @Param("search") String search,
            Pageable pageable
    );
}
