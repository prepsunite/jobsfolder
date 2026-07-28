package com.prepunite.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDto {
    private long totalUsers;
    private long totalCompanies;
    private long totalQuestions;
    private long totalExperiences;
    private long pendingApprovals;
    private long totalResources;
    private long totalRoadmaps;
}
