package com.mantra.mantra_api.dto;

import com.mantra.mantra_api.dto.ai.AIResponse;

public class OptimizationResult {

    private String optimizedPrompt;

    private AIResponse aiResponse;

    public OptimizationResult(
            String optimizedPrompt,
            AIResponse aiResponse) {

        this.optimizedPrompt = optimizedPrompt;
        this.aiResponse = aiResponse;
    }

    public String getOptimizedPrompt() {
        return optimizedPrompt;
    }

    public AIResponse getAiResponse() {
        return aiResponse;
    }
}