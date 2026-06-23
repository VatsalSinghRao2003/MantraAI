package com.mantra.mantra_api.dto;

public class ModelCompareResult {
    private String model;
    private String optimizedPrompt;
    private long responseTimeMs;
    private int score;
    private Integer tokenCount;
    private boolean success;
    private String error;

    public ModelCompareResult() {}

    public ModelCompareResult(String model, String optimizedPrompt,
                               long responseTimeMs, int score,
                               Integer tokenCount, boolean success) {
        this.model = model;
        this.optimizedPrompt = optimizedPrompt;
        this.responseTimeMs = responseTimeMs;
        this.score = score;
        this.tokenCount = tokenCount;
        this.success = success;
    }

    public String getModel() { return model; }
    public void setModel(String v) { this.model = v; }

    public String getOptimizedPrompt() { return optimizedPrompt; }
    public void setOptimizedPrompt(String v) { this.optimizedPrompt = v; }

    public long getResponseTimeMs() { return responseTimeMs; }
    public void setResponseTimeMs(long v) { this.responseTimeMs = v; }

    public int getScore() { return score; }
    public void setScore(int v) { this.score = v; }

    public Integer getTokenCount() { return tokenCount; }
    public void setTokenCount(Integer v) { this.tokenCount = v; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean v) { this.success = v; }

    public String getError() { return error; }
    public void setError(String v) { this.error = v; }
}
