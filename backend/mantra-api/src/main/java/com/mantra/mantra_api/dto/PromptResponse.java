package com.mantra.mantra_api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PromptResponse {

    private String originalPrompt;
    private String optimizedPrompt;
    private Integer score;
    private String category;

    private List<String> strengths;
    private List<String> missingElements;
}
