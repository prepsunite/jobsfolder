package com.prepunite.company.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyDto {
    private UUID id;
    private String name;
    private String slug;
    private String logoUrl;
    private String website;
    private String description;
    private String industry;
    private String companySize;
    private String headquarters;
    private Integer foundedYear;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private List<CompanyRoleDto> roles;
    private List<HiringProcessDto> hiringProcesses;
}
