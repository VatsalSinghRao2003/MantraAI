package com.mantra.mantra_api.dto;

import java.util.List;

public class ModelCompareRequest {
    private String prompt;
    private List<String> models;

    public String getPrompt() { return prompt; }
    public void setPrompt(String v) { this.prompt = v; }

    public List<String> getModels() { return models; }
    public void setModels(List<String> v) { this.models = v; }
}
