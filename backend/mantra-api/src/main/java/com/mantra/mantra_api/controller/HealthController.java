package com.mantra.mantra_api.controller;

import com.mantra.mantra_api.service.AIProviderService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    private final AIProviderService aiProviderService;

    public HealthController(
            AIProviderService aiProviderService) {

        this.aiProviderService =
                aiProviderService;
    }

    @GetMapping("/api/health/ai")
    public Map<String, Object> aiHealth() {

        boolean connected =
                aiProviderService.isHealthy();

        return Map.of(
                "status",
                connected ? "UP" : "DOWN",

                "provider",
                "Ollama",

                "model",
                "llama3.2"
        );
    }
}
