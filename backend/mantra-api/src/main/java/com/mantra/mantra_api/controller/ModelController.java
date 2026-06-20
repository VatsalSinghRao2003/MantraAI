package com.mantra.mantra_api.controller;

import com.mantra.mantra_api.dto.ai.ModelResponse;
import com.mantra.mantra_api.service.ModelService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ModelController {

    private final ModelService modelService;

    public ModelController(
            ModelService modelService) {

        this.modelService =
                modelService;
    }

    @GetMapping("/api/models")
    public List<ModelResponse.ModelInfo>
    getModels() {

        return modelService.getModels();
    }
}
