package com.mantra.mantra_api.dto.ai;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ModelResponse {

    private List<ModelInfo> data;

    public List<ModelInfo> getModels() {
        return data; // map data to getModels for backward compatibility
    }

    public void setData(List<ModelInfo> data) {
        this.data = data;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ModelInfo {
        private String id;
        
        public String getName() {
            return id; // map id to getName for backward compatibility
        }
        
        public void setId(String id) {
            this.id = id;
        }
    }
}