package com.mantra.mantra_api.controller;

import com.mantra.mantra_api.dto.*;
import com.mantra.mantra_api.dto.ai.AIResponse;
import com.mantra.mantra_api.entity.PromptHistory;
import com.mantra.mantra_api.repository.PromptHistoryRepository;
import com.mantra.mantra_api.service.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prompts")
public class PromptController {

    private final OptimizerService optimizerService;
    private final ScoreService scoreService;
    private final CategoryService categoryService;
    private final AnalysisService analysisService;
    private final PromptHistoryRepository historyRepository;
    private final AIProviderService aiProviderService;
    private final TemplateService templateService;

    public PromptController(
            OptimizerService optimizerService,
            AIProviderService aiProviderService,
            ScoreService scoreService,
            CategoryService categoryService,
            AnalysisService analysisService,
            PromptHistoryRepository historyRepository,
            TemplateService templateService) {

        this.optimizerService = optimizerService;
        this.aiProviderService = aiProviderService;
        this.scoreService = scoreService;
        this.categoryService = categoryService;
        this.analysisService = analysisService;
        this.historyRepository = historyRepository;
        this.templateService = templateService;
    }

    // ─── Optimize ────────────────────────────────────────────────────────────────

    @PostMapping("/optimize")
    public PromptResponse optimizePrompt(@RequestBody PromptRequest request) {
        String prompt = request.getPrompt();

        // Call AI with full response to capture metrics
        AIResponse aiResponse = aiProviderService.optimizeWithMetrics(prompt);
        String optimized = aiResponse.getResponse();

        PromptAnalysis analysis = analysisService.analyze(prompt);
        String category = categoryService.detectCategory(prompt);

        // Persist to history including AI performance metrics
        PromptHistory history = new PromptHistory();
        history.setOriginalPrompt(prompt);
        history.setOptimizedPrompt(optimized);
        history.setScore(analysis.getScore());
        history.setCategory(category);
        history.setCreatedAt(LocalDateTime.now());
        history.setModel(aiResponse.getModel());
        history.setTotalDuration(aiResponse.getTotalDuration());
        history.setLoadDuration(aiResponse.getLoadDuration());
        history.setPromptEvalCount(aiResponse.getPromptEvalCount());
        history.setEvalCount(aiResponse.getEvalCount());

        historyRepository.save(history);

        return new PromptResponse(
                prompt,
                optimized,
                analysis.getScore(),
                category,
                analysis.getStrengths(),
                analysis.getMissingElements()
        );
    }

    // ─── Feedback ────────────────────────────────────────────────────────────────

    @PostMapping("/feedback")
    public FeedbackResponse feedback(@RequestBody PromptRequest request) {
        String feedback = aiProviderService.getFeedback(request.getPrompt());
        return new FeedbackResponse(feedback);
    }

    // ─── Templates ───────────────────────────────────────────────────────────────

    @GetMapping("/templates")
    public List<PromptTemplate> getTemplates() {
        return templateService.getTemplates();
    }

    // ─── Compare ─────────────────────────────────────────────────────────────────

    @PostMapping("/compare")
    public CompareResponse comparePrompts(@RequestBody CompareRequest request) {
        int score1 = scoreService.calculateScore(request.getPrompt1());
        int score2 = scoreService.calculateScore(request.getPrompt2());
        String winner = score1 >= score2 ? "prompt1" : "prompt2";
        return new CompareResponse(score1, score2, winner);
    }

    // ─── History ─────────────────────────────────────────────────────────────────

    @GetMapping("/history")
    public List<PromptHistory> getHistory() {
        return historyRepository.findAll();
    }

    @GetMapping("/history/latest")
    public List<PromptHistory> getLatestHistory() {
        return historyRepository.findTop10ByOrderByCreatedAtDesc();
    }

    @GetMapping("/history/search")
    public List<PromptHistory> searchHistory(@RequestParam String q) {
        return historyRepository.findByOriginalPromptContainingIgnoreCase(q);
    }

    @DeleteMapping("/history/{id}")
    public Map<String, String> deleteHistory(@PathVariable Long id) {
        historyRepository.deleteById(id);
        return Map.of("message", "Deleted successfully");
    }

    // ─── Export ──────────────────────────────────────────────────────────────────

    @GetMapping("/export")
    public ResponseEntity<String> exportHistory() {
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Prompt,Category,Score,Model,TotalDurationMs,EvalCount\n");

        historyRepository.findAll().forEach(h -> {
            long durationMs = h.getTotalDuration() != null ? h.getTotalDuration() / 1_000_000 : 0;
            csv.append(h.getId()).append(",")
               .append("\"").append(h.getOriginalPrompt().replace("\"", "'")).append("\"").append(",")
               .append(h.getCategory()).append(",")
               .append(h.getScore()).append(",")
               .append(h.getModel() != null ? h.getModel() : "").append(",")
               .append(durationMs).append(",")
               .append(h.getEvalCount() != null ? h.getEvalCount() : 0)
               .append("\n");
        });

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=prompt-history.csv")
                .body(csv.toString());
    }

    // ─── Stats / Analytics ───────────────────────────────────────────────────────

    @GetMapping("/stats")
    public StatsResponse getStats() {
        long totalPrompts = historyRepository.count();
        Double avg = historyRepository.getAverageScore();
        return new StatsResponse(totalPrompts, avg == null ? 0 : avg);
    }

    @GetMapping("/categories")
    public Map<String, Long> getCategories() {
        Map<String, Long> result = new HashMap<>();
        historyRepository.getCategoryStats().forEach(row ->
                result.put((String) row[0], ((Number) row[1]).longValue())
        );
        return result;
    }
}
