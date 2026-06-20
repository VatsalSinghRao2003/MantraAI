package com.mantra.mantra_api.dto;

import java.util.List;

public class PromptAnalysis {

    private int score;
    private List<String> strengths;
    private List<String> missingElements;

    public PromptAnalysis(
            int score,
            List<String> strengths,
            List<String> missingElements) {

        this.score = score;
        this.strengths = strengths;
        this.missingElements = missingElements;
    }

    public int getScore() {
        return score;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public List<String> getMissingElements() {
        return missingElements;
    }
}
