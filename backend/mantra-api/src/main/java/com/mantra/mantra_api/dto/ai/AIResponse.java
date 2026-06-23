package com.mantra.mantra_api.dto.ai;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AIResponse {
    private List<Choice> choices;
    private String model;

    public static class Choice {
        private Message message;
        public Message getMessage() { return message; }
        public void setMessage(Message message) { this.message = message; }
    }

    public static class Message {
        private String content;
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    private String fallbackResponse;

    public String getResponse() {
        if (choices != null && !choices.isEmpty() && choices.get(0).getMessage() != null) {
            return choices.get(0).getMessage().getContent();
        }
        return fallbackResponse != null ? fallbackResponse : "";
    }

    public Integer getEvalCount() { return 0; }
    public Integer getPromptEvalCount() { return 0; }
    public Long getTotalDuration() { return 0L; }
    public Long getLoadDuration() { return 0L; }

    public List<Choice> getChoices() { return choices; }
    public void setChoices(List<Choice> choices) { this.choices = choices; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    
    public void setResponse(String response) {
        this.fallbackResponse = response;
    }
}
