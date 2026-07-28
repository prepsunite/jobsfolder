package com.prepunite.company.service;

import com.prepunite.company.dto.CompanyDto;
import com.prepunite.company.dto.CreateCompanyRequest;
import com.prepunite.company.entity.Company;
import com.prepunite.company.mapper.CompanyMapper;
import com.prepunite.company.repository.CompanyRepository;
import com.prepunite.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    @Transactional(readOnly = true)
    public Page<CompanyDto> getCompanies(String search, Pageable pageable) {
        Page<Company> companies;
        if (search != null && !search.isBlank()) {
            companies = companyRepository.searchCompanies(search.trim(), pageable);
        } else {
            companies = companyRepository.findByIsActiveTrue(pageable);
        }
        return companies.map(companyMapper::toDto);
    }

    @Transactional(readOnly = true)
    public CompanyDto getCompanyBySlug(String slug) {
        Company company = companyRepository.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("Company not found with slug: " + slug));
        return companyMapper.toDto(company);
    }

    @Transactional(readOnly = true)
    public CompanyDto getCompanyById(UUID id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Company not found with id: " + id));
        return companyMapper.toDto(company);
    }

    @Transactional
    public CompanyDto createCompany(CreateCompanyRequest request) {
        String slug = toSlug(request.getName());
        if (companyRepository.existsBySlug(slug)) {
            slug = slug + "-" + UUID.randomUUID().toString().substring(0, 6);
        }

        Company company = Company.builder()
                .name(request.getName())
                .slug(slug)
                .logoUrl(request.getLogoUrl())
                .website(request.getWebsite())
                .description(request.getDescription())
                .industry(request.getIndustry())
                .companySize(request.getCompanySize())
                .headquarters(request.getHeadquarters())
                .foundedYear(request.getFoundedYear())
                .isActive(true)
                .build();

        Company savedCompany = companyRepository.save(company);
        return companyMapper.toDto(savedCompany);
    }

    @Transactional
    public CompanyDto updateCompany(UUID id, CreateCompanyRequest request) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Company not found with id: " + id));

        company.setName(request.getName());
        if (request.getLogoUrl() != null) company.setLogoUrl(request.getLogoUrl());
        if (request.getWebsite() != null) company.setWebsite(request.getWebsite());
        if (request.getDescription() != null) company.setDescription(request.getDescription());
        if (request.getIndustry() != null) company.setIndustry(request.getIndustry());
        if (request.getCompanySize() != null) company.setCompanySize(request.getCompanySize());
        if (request.getHeadquarters() != null) company.setHeadquarters(request.getHeadquarters());
        if (request.getFoundedYear() != null) company.setFoundedYear(request.getFoundedYear());

        Company updated = companyRepository.save(company);
        return companyMapper.toDto(updated);
    }

    @Transactional
    public void deleteCompany(UUID id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Company not found with id: " + id));
        company.setIsActive(false);
        companyRepository.save(company);
    }

    private String toSlug(String input) {
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}
