package com.mantra.mantra_api.controller;

import com.mantra.mantra_api.entity.PromptHistory;
import com.mantra.mantra_api.repository.PromptHistoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/prompts")
public class FavoritesController {

    private final PromptHistoryRepository historyRepository;

    public FavoritesController(PromptHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    // ─── Favorites ───────────────────────────────────────────────────────────────

    @GetMapping("/favorites")
    public List<PromptHistory> getFavorites() {
        return historyRepository.findByFavoriteTrue();
    }

    @PostMapping("/{id}/favorite")
    public Map<String, Object> toggleFavorite(@PathVariable Long id) {
        PromptHistory h = historyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prompt not found: " + id));
        h.setFavorite(!h.getFavorite());
        historyRepository.save(h);
        return Map.of("id", id, "favorite", h.getFavorite());
    }

    // ─── Tags ────────────────────────────────────────────────────────────────────

    @GetMapping("/tags")
    public List<String> getAllTags() {
        return historyRepository.findAllTags().stream()
                .filter(t -> t != null && !t.isBlank())
                .flatMap(t -> Stream.of(t.split(",")))
                .map(String::trim)
                .filter(t -> !t.isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    @PostMapping("/{id}/tags")
    public Map<String, Object> setTags(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        PromptHistory h = historyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prompt not found: " + id));
        h.setTags(body.get("tags"));
        historyRepository.save(h);
        return Map.of("id", id, "tags", h.getTags() != null ? h.getTags() : "");
    }

    @GetMapping("/by-tag")
    public List<PromptHistory> getByTag(@RequestParam String tag) {
        return historyRepository.findByTagsContainingIgnoreCase(tag);
    }

    @GetMapping("/by-category")
    public List<PromptHistory> getByCategory(@RequestParam String category) {
        return historyRepository.findByCategoryIgnoreCase(category);
    }
}
