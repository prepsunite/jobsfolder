package com.prepunite.resource.service;

import com.prepunite.common.enums.ResourceCategory;
import com.prepunite.exception.EntityNotFoundException;
import com.prepunite.resource.dto.CreateResourceRequest;
import com.prepunite.resource.dto.ResourceDto;
import com.prepunite.resource.entity.Resource;
import com.prepunite.resource.mapper.ResourceMapper;
import com.prepunite.resource.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final ResourceMapper resourceMapper;

    @Transactional(readOnly = true)
    public Page<ResourceDto> getResources(ResourceCategory category, String search, Pageable pageable) {
        return resourceRepository.filterResources(category, search, pageable)
                .map(resourceMapper::toDto);
    }

    @Transactional(readOnly = true)
    public ResourceDto getResourceById(UUID id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Resource not found with id: " + id));

        resource.setViewCount(resource.getViewCount() + 1);
        resourceRepository.save(resource);

        return resourceMapper.toDto(resource);
    }

    @Transactional
    public ResourceDto createResource(CreateResourceRequest request) {
        Resource resource = Resource.builder()
                .title(request.getTitle())
                .url(request.getUrl())
                .category(request.getCategory())
                .description(request.getDescription())
                .thumbnailUrl(request.getThumbnailUrl())
                .tags(request.getTags() != null ? request.getTags() : Collections.emptySet())
                .isVerified(true)
                .isActive(true)
                .build();

        Resource saved = resourceRepository.save(resource);
        return resourceMapper.toDto(saved);
    }

    @Transactional
    public void deleteResource(UUID id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Resource not found with id: " + id));
        resource.setIsActive(false);
        resourceRepository.save(resource);
    }
}
