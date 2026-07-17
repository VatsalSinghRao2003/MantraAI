package com.mantra.mantra_api.service;

import com.mantra.mantra_api.dto.PromptAnalysis;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AnalysisService {

    public PromptAnalysis analyze(String prompt) {

        List<String> strengths =
                new ArrayList<>();

        List<String> missingElements =
                new ArrayList<>();

        int score = 100;

        String lowerPrompt = prompt.toLowerCase();

        // 1. Technology Stack
        List<String> techKeywords = List.of(
            "java", "spring", "react", "python", "js", "javascript", "ts", "typescript",
            "html", "css", "sql", "ruby", "rails", "php", "go", "golang", "rust", "swift",
            "kotlin", "node", "database", "framework", "library", "stack", "technology", "technologies"
        );
        boolean hasTech = techKeywords.stream().anyMatch(lowerPrompt::contains);
        if (hasTech) {
            strengths.add("Technology stack specified");
        } else {
            missingElements.add("Technology Stack");
            score -= 10;
        }

        // 2. Clear Objective
        if (prompt.split("\\s+").length > 5) {
            strengths.add("Clear objective provided");
        } else {
            missingElements.add("Clear Objective");
            score -= 10;
        }

        // 3. Output Format
        List<String> formatKeywords = List.of("output", "format", "response", "structure", "return", "result");
        boolean hasFormat = formatKeywords.stream().anyMatch(lowerPrompt::contains);
        if (hasFormat) {
            strengths.add("Output format specified");
        } else {
            missingElements.add("Output Format");
            score -= 10;
        }

        // 4. Audience
        List<String> audienceKeywords = List.of("audience", "user", "persona", "reader", "role", "consumer");
        boolean hasAudience = audienceKeywords.stream().anyMatch(lowerPrompt::contains);
        if (hasAudience) {
            strengths.add("Target audience specified");
        } else {
            missingElements.add("Audience");
            score -= 10;
        }

        return new PromptAnalysis(
                Math.max(0, score),
                strengths,
                missingElements
        );
    }
}
