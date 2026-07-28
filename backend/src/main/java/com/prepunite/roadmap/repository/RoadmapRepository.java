package com.prepunite.roadmap.repository;

import com.prepunite.roadmap.entity.Roadmap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, UUID> {
    Page<Roadmap> findByIsPublishedTrue(Pageable pageable);
    Optional<Roadmap> findByCompanyId(UUID companyId);
}
