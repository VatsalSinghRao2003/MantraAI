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

    @Value("${mantra.ai.url}")
    private String aiUrl;

    public AIProviderService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String optimize(String prompt) {

        AIRequest request = new AIRequest();

        request.setModel("llama3.2:latest");

        request.setPrompt(
                "You are Mantra AI, an expert prompt optimizer.\n\n" +
                "Transform the user's prompt into a highly detailed and structured prompt.\n" +
                "Do NOT answer the prompt.\n" +
                "Do NOT generate code.\n" +
                "Only return the optimized prompt.\n\n" +
                "User Prompt:\n" +
                prompt
        );

        request.setStream(false);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("ngrok-skip-browser-warning", "true");

        HttpEntity<AIRequest> entity =
                new HttpEntity<>(request, headers);

        try {

            ResponseEntity<AIResponse> response =
                    restTemplate.postForEntity(
                            aiUrl,
                            entity,
                            AIResponse.class
                    );

            if (response.getBody() != null) {
                return response.getBody().getResponse();
            }

        } catch (Exception ex) {

            System.out.println(
                    "AI Provider Error: "
                            + ex.getMessage());

        }

        return """
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
                """.formatted(prompt);
    }

    public String getFeedback(String prompt) {

        AIRequest request = new AIRequest();

        request.setModel("llama3.2:latest");

        request.setPrompt(
                """
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
                """.formatted(prompt)
        );

        request.setStream(false);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("ngrok-skip-browser-warning", "true");

        HttpEntity<AIRequest> entity =
                new HttpEntity<>(request, headers);

        ResponseEntity<AIResponse> response =
                restTemplate.postForEntity(
                        aiUrl,
                        entity,
                        AIResponse.class);

        return response.getBody().getResponse();
    }

    public boolean isHealthy() {

        try {

            AIRequest request =
                    new AIRequest();

            request.setModel(
                    "llama3.2:latest");

            request.setPrompt("hello");

            request.setStream(false);

            HttpHeaders headers =
                    new HttpHeaders();

            headers.setContentType(
                    MediaType.APPLICATION_JSON);

            headers.add(
                    "ngrok-skip-browser-warning",
                    "true");

            HttpEntity<AIRequest> entity =
                    new HttpEntity<>(
                            request,
                            headers);

            ResponseEntity<AIResponse> response =
                    restTemplate.postForEntity(
                            aiUrl,
                            entity,
                            AIResponse.class);

            return response.getStatusCode()
                    .is2xxSuccessful();

        } catch (Exception ex) {

            return false;
        }
    }
}