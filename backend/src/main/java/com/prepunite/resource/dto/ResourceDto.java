package com.prepunite.resource.dto;

import com.prepunite.common.enums.ResourceCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceDto {
    private UUID id;
    private String title;
    private String url;
    private ResourceCategory category;
    private String description;
    private String thumbnailUrl;
    private Boolean isVerified;
    private Integer viewCount;
    private Set<String> tags;
    private LocalDateTime createdAt;
}
