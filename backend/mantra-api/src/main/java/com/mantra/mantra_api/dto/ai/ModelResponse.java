package com.mantra.mantra_api.dto.ai;

import java.util.List;

public class ModelResponse {

    private List<ModelInfo> models;

    public List<ModelInfo> getModels() {
        return models;
    }

    public void setModels(
            List<ModelInfo> models) {

        this.models = models;
    }

    public static class ModelInfo {

        private String name;

        public String getName() {
            return name;
        }

        public void setName(
                String name) {

            this.name = name;
        }
    }
}