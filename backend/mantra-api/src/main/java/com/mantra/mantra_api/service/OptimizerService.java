package com.mantra.mantra_api.service;

import org.springframework.stereotype.Service;

@Service
public class OptimizerService {

    private final AIProviderService aiProviderService;

    public OptimizerService(
            AIProviderService aiProviderService) {

        this.aiProviderService =
                aiProviderService;
    }

    public String optimize(String prompt) {

        return aiProviderService.optimize(
                prompt);
    }
}
