package com.mantra.mantra_api.service;

import com.mantra.mantra_api.dto.ai.AIRequest;
import com.mantra.mantra_api.dto.ai.AIResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AIProviderService {

    private final RestTemplate restTemplate;

    @Value("${groq.api.url}")
    private String aiUrl;

    @Value("${groq.api.key}")
    private String groqApiKey;

    public AIProviderService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // ─── Core helper ────────────────────────────────────────────────────────────

    private AIResponse callOllama(String prompt, String model) {
        AIRequest request = new AIRequest();
        request.setModel(model != null ? model : "meta-llama/llama-4-scout-17b-16e-instruct");
        request.setPrompt(prompt);
        request.setStream(false);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + groqApiKey);

        HttpEntity<AIRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<AIResponse> response = restTemplate.postForEntity(
                aiUrl, entity, AIResponse.class);

        return response.getBody();
    }

    // ─── Optimize ────────────────────────────────────────────────────────────────

    /**
     * Returns the full AIResponse so callers can access metrics
     * (totalDuration, loadDuration, evalCount, model, etc.)
     */
    public AIResponse optimizeWithMetrics(String prompt) {
        String systemPrompt =
                "You are Mantra AI, an expert prompt optimizer.\n\n" +
                "Transform the user's prompt into a highly detailed and structured prompt.\n" +
                "Do NOT answer the prompt.\n" +
                "Do NOT generate code.\n" +
                "Only return the optimized prompt.\n\n" +
                "User Prompt:\n" + prompt;

        try {
            return callOllama(systemPrompt, null);
        } catch (Exception ex) {
            System.out.println("AI Provider Error: " + ex.getMessage());
            // Return a fallback response object with a default optimized prompt
            AIResponse fallback = new AIResponse();
            fallback.setResponse("""
                    ROLE:
                    Expert Software Engineer

                    TASK:
                    %s

                    REQUIREMENTS:
                    - Explain objective
                    - List assumptions
                    - Define architecture
                    - Define implementation steps
                    - Include edge cases
                    - Provide expected output
                    """.formatted(prompt));
            fallback.setModel("fallback");
            return fallback;
        }
    }

    /** Convenience: returns only the text response (backward compat) */
    public String optimize(String prompt) {
        AIResponse r = optimizeWithMetrics(prompt);
        return r != null ? r.getResponse() : "";
    }

    // ─── Feedback ────────────────────────────────────────────────────────────────

    public AIResponse getFeedbackWithMetrics(String prompt) {
        String systemPrompt = """
                You are a prompt engineering expert.

                Analyze the following prompt and return:

                Strengths:
                - ...

                Weaknesses:
                - ...

                Suggestions:
                - ...

                Prompt:
                %s
                """.formatted(prompt);

        try {
            return callOllama(systemPrompt, null);
        } catch (Exception ex) {
            System.out.println("AI Feedback Error: " + ex.getMessage());
            AIResponse fallback = new AIResponse();
            fallback.setResponse("Unable to analyze prompt. AI backend is unavailable.");
            return fallback;
        }
    }

    public String getFeedback(String prompt) {
        AIResponse r = getFeedbackWithMetrics(prompt);
        return r != null ? r.getResponse() : "";
    }

    // ─── Health ──────────────────────────────────────────────────────────────────

    public boolean isHealthy() {
        try {
            String modelsUrl = aiUrl.replace("/chat/completions", "/models");

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + groqApiKey);

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    modelsUrl, org.springframework.http.HttpMethod.GET, entity, String.class);

            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception ex) {
            System.err.println("AI Provider Health Check failed: " + ex.getMessage());
            ex.printStackTrace();
            return false;
        }
    }
}