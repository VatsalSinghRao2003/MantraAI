package com.mantra.mantra_api.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AIResponse {

    private String response;

    @JsonProperty("total_duration")
    private Long totalDuration;

    @JsonProperty("load_duration")
    private Long loadDuration;

    @JsonProperty("prompt_eval_count")
    private Integer promptEvalCount;

    @JsonProperty("eval_count")
    private Integer evalCount;

    public String getResponse() {
        return response;
    }

    public void setResponse(
            String response) {

        this.response = response;
    }

    public Long getTotalDuration() {
        return totalDuration;
    }

    public void setTotalDuration(
            Long totalDuration) {

        this.totalDuration =
                totalDuration;
    }

    public Long getLoadDuration() {
        return loadDuration;
    }

    public void setLoadDuration(
            Long loadDuration) {

        this.loadDuration =
                loadDuration;
    }

    public Integer getPromptEvalCount() {
        return promptEvalCount;
    }

    public void setPromptEvalCount(
            Integer promptEvalCount) {

        this.promptEvalCount =
                promptEvalCount;
    }

    public Integer getEvalCount() {
        return evalCount;
    }

    public void setEvalCount(
            Integer evalCount) {

        this.evalCount =
                evalCount;
    }
}
