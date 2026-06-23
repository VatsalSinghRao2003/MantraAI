package com.mantra.mantra_api.controller;

import com.mantra.mantra_api.entity.PromptCollection;
import com.mantra.mantra_api.entity.PromptHistory;
import com.mantra.mantra_api.entity.User;
import com.mantra.mantra_api.repository.PromptCollectionRepository;
import com.mantra.mantra_api.repository.PromptHistoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/collections")
public class CollectionController {

    private final PromptCollectionRepository collectionRepository;
    private final PromptHistoryRepository historyRepository;

    public CollectionController(PromptCollectionRepository collectionRepository, PromptHistoryRepository historyRepository) {
        this.collectionRepository = collectionRepository;
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
    public ResponseEntity<?> createCollection(@RequestBody PromptCollection collection) {
        User user = getCurrentUser();
        if (user != null) {
            collection.setUserId(user.getId());
        }
        PromptCollection saved = collectionRepository.save(collection);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<?> listCollections(@RequestParam(required = false) Long workspaceId) {
        User user = getCurrentUser();
        if (workspaceId != null) {
            return ResponseEntity.ok(collectionRepository.findByWorkspaceId(workspaceId));
        }
        if (user != null) {
            return ResponseEntity.ok(collectionRepository.findByUserId(user.getId()));
        }
        return ResponseEntity.ok(collectionRepository.findAll());
    }

    @PostMapping("/{id}/prompts")
    public ResponseEntity<?> addPromptToCollection(@PathVariable Long id, @RequestBody Map<String, Long> payload) {
        Optional<PromptCollection> colOpt = collectionRepository.findById(id);
        if (colOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Collection not found"));
        }
        Long promptId = payload.get("promptId");
        if (promptId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "promptId is required"));
        }
        Optional<PromptHistory> historyOpt = historyRepository.findById(promptId);
        if (historyOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Prompt not found"));
        }

        PromptCollection collection = colOpt.get();
        PromptHistory prompt = historyOpt.get();
        if (!collection.getPrompts().contains(prompt)) {
            collection.getPrompts().add(prompt);
            collectionRepository.save(collection);
        }
        return ResponseEntity.ok(collection);
    }

    @GetMapping("/{id}/prompts")
    public ResponseEntity<?> getCollectionPrompts(@PathVariable Long id) {
        Optional<PromptCollection> colOpt = collectionRepository.findById(id);
        if (colOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Collection not found"));
        }
        return ResponseEntity.ok(colOpt.get().getPrompts());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCollection(@PathVariable Long id) {
        if (!collectionRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Collection not found"));
        }
        collectionRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Collection deleted successfully"));
    }
}
