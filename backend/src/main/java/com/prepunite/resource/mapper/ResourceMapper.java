package com.prepunite.resource.mapper;

import com.prepunite.resource.dto.ResourceDto;
import com.prepunite.resource.entity.Resource;
import org.springframework.stereotype.Component;

@Component
public class ResourceMapper {

    public ResourceDto toDto(Resource resource) {
        if (resource == null) return null;

        return ResourceDto.builder()
                .id(resource.getId())
                .title(resource.getTitle())
                .url(resource.getUrl())
                .category(resource.getCategory())
                .description(resource.getDescription())
                .thumbnailUrl(resource.getThumbnailUrl())
                .isVerified(resource.getIsVerified())
                .viewCount(resource.getViewCount())
                .tags(resource.getTags())
                .createdAt(resource.getCreatedAt())
                .build();
    }
}
