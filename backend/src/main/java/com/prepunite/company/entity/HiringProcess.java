package com.prepunite.company.entity;

import com.prepunite.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hiring_process")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HiringProcess extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "round_number", nullable = false)
    private Integer roundNumber;

    @Column(name = "round_type", nullable = false)
    private String roundType;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(columnDefinition = "TEXT")
    private String tips;
}
