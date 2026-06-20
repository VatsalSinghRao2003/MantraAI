package com.mantra.mantra_api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PromptTemplate {

    private String category;
    private String template;
}
