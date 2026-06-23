package com.mantra.mantra_api.dto.ai;

import java.util.List;

public class AIRequest {
    private String model = "llama-3.1-8b-instant";
    private List<Message> messages;
    private double temperature = 0.2;

    public AIRequest() {}

    public void setPrompt(String prompt) {
        this.messages = List.of(new Message("user", prompt));
    }

    public void setModel(String model) {
        if (model != null && !model.isEmpty()) {
            this.model = model;
        }
    }

    public void setStream(boolean stream) {
    }

    public String getModel() { return model; }
    public List<Message> getMessages() { return messages; }
    public double getTemperature() { return temperature; }
    public void setTemperature(double temperature) { this.temperature = temperature; }

    public static class Message {
        private String role;
        private String content;

        public Message(String role, String content) {
            this.role = role;
            this.content = content;
        }
        public String getRole() { return role; }
        public String getContent() { return content; }
    }
}
