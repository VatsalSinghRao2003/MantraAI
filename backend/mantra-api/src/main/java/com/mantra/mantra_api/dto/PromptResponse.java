package com.mantra.mantra_api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PromptResponse {

    private String originalPrompt;
    private String optimizedPrompt;
    private Integer score;
    private String category;

}
