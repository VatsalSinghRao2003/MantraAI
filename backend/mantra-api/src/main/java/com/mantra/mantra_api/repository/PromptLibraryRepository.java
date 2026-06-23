package com.mantra.mantra_api.repository;

import com.mantra.mantra_api.entity.PromptLibrary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PromptLibraryRepository extends JpaRepository<PromptLibrary, Long> {
    List<PromptLibrary> findByIsPublicTrue();
    List<PromptLibrary> findByWorkspaceId(Long workspaceId);
    List<PromptLibrary> findByIsPublicTrueOrWorkspaceId(boolean isPublic, Long workspaceId);
}
