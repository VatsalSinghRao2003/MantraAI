package com.mantra.mantra_api.dto;

public class PromptRequest {
    private String prompt;
    private String model; // Optional - defaults to configured model

    public String getPrompt() { return prompt; }
    public void setPrompt(String v) { this.prompt = v; }

    public String getModel() { return model; }
    public void setModel(String v) { this.model = v; }
}
