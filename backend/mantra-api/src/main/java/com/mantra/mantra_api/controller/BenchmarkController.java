package com.mantra.mantra_api.controller;

import com.mantra.mantra_api.dto.BenchmarkRequest;
import com.mantra.mantra_api.dto.BenchmarkResponse;
import com.mantra.mantra_api.dto.PromptAnalysis;
import com.mantra.mantra_api.service.AnalysisService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prompts")
public class BenchmarkController {

    private final AnalysisService analysisService;

    public BenchmarkController(
            AnalysisService analysisService) {

        this.analysisService =
                analysisService;
    }

    @PostMapping("/benchmark")
    public BenchmarkResponse benchmark(
            @RequestBody BenchmarkRequest request) {

        PromptAnalysis analysis1 =
                analysisService.analyze(
                        request.getPrompt1());

        PromptAnalysis analysis2 =
                analysisService.analyze(
                        request.getPrompt2());

        int score1 =
                analysis1.getScore();

        int score2 =
                analysis2.getScore();

        String winner;

        if (score1 > score2) {
            winner = "prompt1";
        } else if (score2 > score1) {
            winner = "prompt2";
        } else {
            winner = "tie";
        }

        return new BenchmarkResponse(
                score1,
                score2,
                request.getPrompt1().length(),
                request.getPrompt2().length(),
                winner
        );
    }
}
