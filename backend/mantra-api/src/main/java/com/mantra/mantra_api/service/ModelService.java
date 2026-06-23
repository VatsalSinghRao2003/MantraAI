package com.mantra.mantra_api.service;

import com.mantra.mantra_api.dto.ai.ModelResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class ModelService {

    private final RestTemplate restTemplate;

    @Value("${groq.api.url}")
    private String aiUrl;

    @Value("${groq.api.key}")
    private String groqApiKey;

    public ModelService(
            RestTemplate restTemplate) {

        this.restTemplate =
                restTemplate;
    }

    public List<ModelResponse.ModelInfo>
    getModels() {

        String tagsUrl = aiUrl.replace("/chat/completions", "/models");

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + groqApiKey);

        HttpEntity<Void> entity =
                new HttpEntity<>(headers);

        ResponseEntity<ModelResponse>
                response =
                restTemplate.exchange(
                        tagsUrl,
                        HttpMethod.GET,
                        entity,
                        ModelResponse.class
                );

        return response.getBody()
                .getModels();
    }
}
