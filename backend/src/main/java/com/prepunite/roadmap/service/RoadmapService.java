package com.prepunite.roadmap.service;

import com.prepunite.exception.EntityNotFoundException;
import com.prepunite.roadmap.dto.RoadmapDto;
import com.prepunite.roadmap.entity.Roadmap;
import com.prepunite.roadmap.mapper.RoadmapMapper;
import com.prepunite.roadmap.repository.RoadmapRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoadmapService {

    private final RoadmapRepository roadmapRepository;
    private final RoadmapMapper roadmapMapper;

    @Transactional(readOnly = true)
    public Page<RoadmapDto> getPublishedRoadmaps(Pageable pageable) {
        return roadmapRepository.findByIsPublishedTrue(pageable)
                .map(roadmapMapper::toDto);
    }

    @Transactional(readOnly = true)
    public RoadmapDto getRoadmapById(UUID id) {
        Roadmap roadmap = roadmapRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Roadmap not found with id: " + id));
        return roadmapMapper.toDto(roadmap);
    }

    @Transactional(readOnly = true)
    public RoadmapDto getRoadmapByCompanyId(UUID companyId) {
        Roadmap roadmap = roadmapRepository.findByCompanyId(companyId)
                .orElseThrow(() -> new EntityNotFoundException("Roadmap not found for company id: " + companyId));
        return roadmapMapper.toDto(roadmap);
    }
}
