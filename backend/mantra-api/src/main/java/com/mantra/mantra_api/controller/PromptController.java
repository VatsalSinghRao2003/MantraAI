package com.mantra.mantra_api.controller;

import com.mantra.mantra_api.dto.PromptRequest;
import com.mantra.mantra_api.dto.PromptResponse;
import com.mantra.mantra_api.service.CategoryService;
import com.mantra.mantra_api.service.OptimizerService;
import com.mantra.mantra_api.service.ScoreService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prompts")
public class PromptController {

private final OptimizerService optimizerService;
private final ScoreService scoreService;
private final CategoryService categoryService;

public PromptController(
        OptimizerService optimizerService,
        ScoreService scoreService,
        CategoryService categoryService) {

    this.optimizerService = optimizerService;
    this.scoreService = scoreService;
    this.categoryService = categoryService;
}

@PostMapping("/optimize")
public PromptResponse optimizePrompt(
        @RequestBody PromptRequest request) {

    String optimized =
            optimizerService.optimize(request.getPrompt());

    int score =
            scoreService.calculateScore(request.getPrompt());

    String category =
            categoryService.detectCategory(request.getPrompt());

    return new PromptResponse(
            request.getPrompt(),
            optimized,
            score,
            category
    );
}

}
