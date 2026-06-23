package com.mantra.mantra_api.repository;

import com.mantra.mantra_api.entity.PromptCollection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PromptCollectionRepository extends JpaRepository<PromptCollection, Long> {
    List<PromptCollection> findByUserId(Long userId);
    List<PromptCollection> findByWorkspaceId(Long workspaceId);
}
