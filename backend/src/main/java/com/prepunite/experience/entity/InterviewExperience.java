package com.prepunite.experience.entity;

import com.prepunite.auth.entity.User;
import com.prepunite.common.entity.BaseEntity;
import com.prepunite.common.enums.ExperienceStatus;
import com.prepunite.common.enums.QuestionDifficulty;
import com.prepunite.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "interview_experiences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewExperience extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    private String role;
    private String college;
    private Integer year;

    @Enumerated(EnumType.STRING)
    private QuestionDifficulty difficulty;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(columnDefinition = "TEXT")
    private String tips;

    @Column(name = "resources_used", columnDefinition = "TEXT")
    private String resourcesUsed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ExperienceStatus status = ExperienceStatus.PENDING;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "is_anonymous", nullable = false)
    @Builder.Default
    private Boolean isAnonymous = false;

    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private Integer viewCount = 0;
}
