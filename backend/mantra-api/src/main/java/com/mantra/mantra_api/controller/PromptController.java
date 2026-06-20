package com.mantra.mantra_api.controller;

import com.mantra.mantra_api.dto.CompareRequest;
import com.mantra.mantra_api.dto.CompareResponse;
import com.mantra.mantra_api.dto.PromptAnalysis;
import com.mantra.mantra_api.dto.PromptRequest;
import com.mantra.mantra_api.dto.PromptResponse;
import com.mantra.mantra_api.dto.PromptTemplate;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import com.mantra.mantra_api.dto.StatsResponse;
import com.mantra.mantra_api.entity.PromptHistory;
import com.mantra.mantra_api.repository.PromptHistoryRepository;
import com.mantra.mantra_api.service.AnalysisService;
import com.mantra.mantra_api.service.CategoryService;
import com.mantra.mantra_api.service.OptimizerService;
import com.mantra.mantra_api.service.ScoreService;
import com.mantra.mantra_api.service.TemplateService;
import com.mantra.mantra_api.service.AIProviderService;
import com.mantra.mantra_api.repository.PromptHistoryRepository;
import java.util.Map;
import org.springframework.web.bind.annotation.*;
import com.mantra.mantra_api.dto.StatsResponse;
import java.time.LocalDateTime;
import com.mantra.mantra_api.dto.FeedbackResponse;
import java.util.List;
import java.util.HashMap;
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

@PostMapping("/feedback")
public FeedbackResponse feedback(
        @RequestBody PromptRequest request) {

    String feedback =
            aiProviderService.getFeedback(
                    request.getPrompt());

    return new FeedbackResponse(
            feedback);
}
@GetMapping("/templates")
public List<PromptTemplate> getTemplates() {

    return templateService.getTemplates();
}


        @GetMapping("/history/search")
public List<PromptHistory> searchHistory(
        @RequestParam String q) {

    return historyRepository
            .findByOriginalPromptContainingIgnoreCase(q);
}

    @PostMapping("/optimize")
    public PromptResponse optimizePrompt(
            @RequestBody PromptRequest request) {

        String prompt = request.getPrompt();

        String optimized =
                optimizerService.optimize(prompt);

        PromptAnalysis analysis =
                analysisService.analyze(prompt);

        String category =
                categoryService.detectCategory(prompt);

        PromptHistory history = new PromptHistory();

        history.setOriginalPrompt(prompt);
        history.setOptimizedPrompt(optimized);
        history.setScore(analysis.getScore());
        history.setCategory(category);
        history.setCreatedAt(LocalDateTime.now());

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
    @PostMapping("/compare")
public CompareResponse comparePrompts(
        @RequestBody CompareRequest request) {

    int score1 =
            scoreService.calculateScore(
                    request.getPrompt1());

    int score2 =
            scoreService.calculateScore(
                    request.getPrompt2());

    String winner =
            score1 >= score2
                    ? "prompt1"
                    : "prompt2";

    return new CompareResponse(
            score1,
            score2,
            winner
    );
}

    @GetMapping("/export")
public ResponseEntity<String> exportHistory() {

    StringBuilder csv = new StringBuilder();

    csv.append("ID,Prompt,Category,Score\n");

    historyRepository.findAll().forEach(history -> {

        csv.append(history.getId())
                .append(",")
                .append("\"")
                .append(history.getOriginalPrompt())
                .append("\"")
                .append(",")
                .append(history.getCategory())
                .append(",")
                .append(history.getScore())
                .append("\n");
    });

    return ResponseEntity.ok()
            .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=prompt-history.csv")
            .body(csv.toString());
}
    @GetMapping("/categories")
public Map<String, Long> getCategories() {

    Map<String, Long> result =
            new HashMap<>();

    historyRepository
            .getCategoryStats()
            .forEach(row -> {

                result.put(
                        (String) row[0],
                        ((Number) row[1]).longValue()
                );
            });

    return result;
}
@DeleteMapping("/history/{id}")
public Map<String, String> deleteHistory(
        @PathVariable Long id) {

    historyRepository.deleteById(id);

    return Map.of(
            "message",
            "Deleted successfully");
}
    @GetMapping("/history/latest")
public List<PromptHistory> getLatestHistory() {

    return historyRepository
            .findTop10ByOrderByCreatedAtDesc();
}

    @GetMapping("/stats")
public StatsResponse getStats() {

    long totalPrompts =
            historyRepository.count();

    Double avg =
            historyRepository.getAverageScore();

    return new StatsResponse(
            totalPrompts,
            avg == null ? 0 : avg
    );
}
    @GetMapping("/history")
    public List<PromptHistory> getHistory() {
        return historyRepository.findAll();
    }
}
