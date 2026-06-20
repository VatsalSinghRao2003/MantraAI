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

        if(prompt.length() > 20) {
            strengths.add("Prompt contains sufficient detail");
        } else {
            missingElements.add("More Detail");
            score -= 10;
        }

        if(prompt.toLowerCase().contains("java")
                || prompt.toLowerCase().contains("spring")
                || prompt.toLowerCase().contains("react")) {

            strengths.add("Technology stack specified");
        } else {
            missingElements.add("Technology Stack");
            score -= 10;
        }

        if(prompt.split(" ").length > 5) {
            strengths.add("Clear objective provided");
        } else {
            missingElements.add("Clear Objective");
            score -= 10;
        }

        if(!prompt.toLowerCase().contains("output")) {
            missingElements.add("Output Format");
            score -= 10;
        }

        if(!prompt.toLowerCase().contains("audience")) {
            missingElements.add("Audience");
            score -= 10;
        }

        return new PromptAnalysis(
                score,
                strengths,
                missingElements
        );
    }
}
