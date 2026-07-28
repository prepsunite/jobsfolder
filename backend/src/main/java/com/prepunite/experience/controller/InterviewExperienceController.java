package com.prepunite.experience.controller;

import com.prepunite.common.enums.ExperienceStatus;
import com.prepunite.experience.dto.InterviewExperienceDto;
import com.prepunite.experience.dto.SubmitExperienceRequest;
import com.prepunite.experience.service.InterviewExperienceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/v1/experiences")
@RequiredArgsConstructor
public class InterviewExperienceController {

    private final InterviewExperienceService experienceService;

    @GetMapping
    public ResponseEntity<Page<InterviewExperienceDto>> getApprovedExperiences(
            @RequestParam(required = false) UUID companyId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(experienceService.getApprovedExperiences(companyId, search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewExperienceDto> getExperienceById(@PathVariable UUID id) {
        return ResponseEntity.ok(experienceService.getExperienceById(id));
    }

    @PostMapping
    public ResponseEntity<InterviewExperienceDto> submitExperience(@Valid @RequestBody SubmitExperienceRequest request) {
        InterviewExperienceDto created = experienceService.submitExperience(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}/moderate")
    public ResponseEntity<InterviewExperienceDto> moderateExperience(
            @PathVariable UUID id,
            @RequestParam ExperienceStatus status,
            @RequestParam(required = false) String rejectionReason
    ) {
        return ResponseEntity.ok(experienceService.moderateExperience(id, status, rejectionReason));
    }
}
