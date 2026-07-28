package com.prepunite.roadmap.controller;

import com.prepunite.roadmap.dto.RoadmapDto;
import com.prepunite.roadmap.service.RoadmapService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/v1/roadmaps")
@RequiredArgsConstructor
public class RoadmapController {

    private final RoadmapService roadmapService;

    @GetMapping
    public ResponseEntity<Page<RoadmapDto>> getRoadmaps(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(roadmapService.getPublishedRoadmaps(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoadmapDto> getRoadmapById(@PathVariable UUID id) {
        return ResponseEntity.ok(roadmapService.getRoadmapById(id));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<RoadmapDto> getRoadmapByCompanyId(@PathVariable UUID companyId) {
        return ResponseEntity.ok(roadmapService.getRoadmapByCompanyId(companyId));
    }
}
