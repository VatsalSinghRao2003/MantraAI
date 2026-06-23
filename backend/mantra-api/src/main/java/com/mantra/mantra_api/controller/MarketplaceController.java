package com.mantra.mantra_api.controller;

import com.mantra.mantra_api.entity.PromptLibrary;
import com.mantra.mantra_api.entity.PromptHistory;
import com.mantra.mantra_api.entity.User;
import com.mantra.mantra_api.repository.PromptLibraryRepository;
import com.mantra.mantra_api.repository.PromptHistoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/library")
public class MarketplaceController {

    private final PromptLibraryRepository libraryRepository;
    private final PromptHistoryRepository historyRepository;

    public MarketplaceController(PromptLibraryRepository libraryRepository, PromptHistoryRepository historyRepository) {
        this.libraryRepository = libraryRepository;
        this.historyRepository = historyRepository;
    }

    private User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User) {
            return (User) auth.getPrincipal();
        }
        return null;
    }

    @PostMapping
    public ResponseEntity<?> createPrompt(@RequestBody PromptLibrary item) {
        User user = getCurrentUser();
        if (user != null) {
            item.setAuthorId(user.getId());
        }
        PromptLibrary saved = libraryRepository.save(item);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<?> listPrompts(@RequestParam(required = false) Long workspaceId) {
        if (workspaceId != null) {
            return ResponseEntity.ok(libraryRepository.findByIsPublicTrueOrWorkspaceId(true, workspaceId));
        }
        return ResponseEntity.ok(libraryRepository.findByIsPublicTrue());
    }

    @GetMapping("/public")
    public ResponseEntity<?> getPublicPrompts() {
        return ResponseEntity.ok(libraryRepository.findByIsPublicTrue());
    }

    @PostMapping("/{id}/clone")
    public ResponseEntity<?> clonePrompt(@PathVariable Long id, @RequestParam(required = false) Long workspaceId) {
        Optional<PromptLibrary> libOpt = libraryRepository.findById(id);
        if (libOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Library prompt not found"));
        }
        PromptLibrary lib = libOpt.get();
        User user = getCurrentUser();

        PromptHistory history = new PromptHistory();
        history.setOriginalPrompt(lib.getPromptText());
        history.setOptimizedPrompt(lib.getPromptText());
        history.setCategory(lib.getCategory());
        history.setScore(100);
        history.setCreatedAt(LocalDateTime.now());
        history.setModel("Library Reference");
        if (user != null) {
            history.setUserId(user.getId());
        }
        if (workspaceId != null) {
            history.setWorkspaceId(workspaceId);
        }

        PromptHistory saved = historyRepository.save(history);
        return ResponseEntity.ok(saved);
    }
}
