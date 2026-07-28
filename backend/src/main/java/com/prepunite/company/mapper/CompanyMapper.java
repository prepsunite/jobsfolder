package com.prepunite.company.mapper;

import com.prepunite.company.dto.CompanyDto;
import com.prepunite.company.dto.CompanyRoleDto;
import com.prepunite.company.dto.HiringProcessDto;
import com.prepunite.company.entity.Company;
import com.prepunite.company.entity.CompanyRole;
import com.prepunite.company.entity.HiringProcess;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
public class CompanyMapper {

    public CompanyDto toDto(Company company) {
        if (company == null) return null;

        return CompanyDto.builder()
                .id(company.getId())
                .name(company.getName())
                .slug(company.getSlug())
                .logoUrl(company.getLogoUrl())
                .website(company.getWebsite())
                .description(company.getDescription())
                .industry(company.getIndustry())
                .companySize(company.getCompanySize())
                .headquarters(company.getHeadquarters())
                .foundedYear(company.getFoundedYear())
                .isActive(company.getIsActive())
                .createdAt(company.getCreatedAt())
                .roles(company.getRoles() != null ?
                        company.getRoles().stream().map(this::toRoleDto).collect(Collectors.toList()) :
                        Collections.emptyList())
                .hiringProcesses(company.getHiringProcesses() != null ?
                        company.getHiringProcesses().stream().map(this::toHiringProcessDto).collect(Collectors.toList()) :
                        Collections.emptyList())
                .build();
    }

    public CompanyRoleDto toRoleDto(CompanyRole role) {
        if (role == null) return null;

        return CompanyRoleDto.builder()
                .id(role.getId())
                .title(role.getTitle())
                .salaryMin(role.getSalaryMin())
                .salaryMax(role.getSalaryMax())
                .salaryCurrency(role.getSalaryCurrency())
                .eligibility(role.getEligibility())
                .roleType(role.getRoleType())
                .description(role.getDescription())
                .build();
    }

    public HiringProcessDto toHiringProcessDto(HiringProcess hp) {
        if (hp == null) return null;

        return HiringProcessDto.builder()
                .id(hp.getId())
                .roundNumber(hp.getRoundNumber())
                .roundType(hp.getRoundType())
                .title(hp.getTitle())
                .description(hp.getDescription())
                .durationMinutes(hp.getDurationMinutes())
                .tips(hp.getTips())
                .build();
    }
}
