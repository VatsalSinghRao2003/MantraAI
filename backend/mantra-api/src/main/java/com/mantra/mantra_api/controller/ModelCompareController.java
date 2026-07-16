package com.mantra.mantra_api.controller;

import com.mantra.mantra_api.dto.ModelCompareRequest;
import com.mantra.mantra_api.dto.ModelCompareResult;
import com.mantra.mantra_api.dto.ai.AIRequest;
import com.mantra.mantra_api.dto.ai.AIResponse;
import com.mantra.mantra_api.service.AnalysisService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

@RestController
@RequestMapping("/api/models")
public class ModelCompareController {

    private final RestTemplate restTemplate;
    private final AnalysisService analysisService;

    @Value("${groq.api.url}")
    private String aiUrl;

    @Value("${groq.api.key}")
    private String groqApiKey;

    public ModelCompareController(RestTemplate restTemplate,
                                   AnalysisService analysisService) {
        this.restTemplate = restTemplate;
        this.analysisService = analysisService;
    }

    @PostMapping("/compare")
    public List<ModelCompareResult> compareModels(
            @RequestBody ModelCompareRequest request) throws InterruptedException {

        String prompt = request.getPrompt();
        List<String> models = request.getModels();

        if (models == null || models.isEmpty()) {
            models = List.of("meta-llama/llama-4-scout-17b-16e-instruct");
        }

        ExecutorService executor = Executors.newFixedThreadPool(
                Math.min(models.size(), 4));

        List<Callable<ModelCompareResult>> tasks = new ArrayList<>();

        for (String model : models) {
            final String m = model;
            tasks.add(() -> {
                long start = System.currentTimeMillis();
                try {
                    AIRequest aiReq = new AIRequest();
                    aiReq.setModel(m);
                    aiReq.setPrompt(
                            "You are Mantra AI, an expert prompt optimizer.\n\n" +
                            "Transform the user's prompt into a highly detailed and structured prompt.\n" +
                            "Do NOT answer the prompt. Only return the optimized prompt.\n\n" +
                            "User Prompt:\n" + prompt
                    );
                    aiReq.setStream(false);

                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_JSON);
                    headers.set("Authorization", "Bearer " + groqApiKey);

                    ResponseEntity<AIResponse> resp = restTemplate.postForEntity(
                            aiUrl,
                            new HttpEntity<>(aiReq, headers),
                            AIResponse.class
                    );

                    AIResponse body = resp.getBody();
                    long elapsed = System.currentTimeMillis() - start;

                    int score = analysisService.analyze(
                            body != null && body.getResponse() != null
                                    ? body.getResponse() : ""
                    ).getScore();

                    return new ModelCompareResult(
                            m,
                            body != null ? body.getResponse() : "",
                            elapsed,
                            score,
                            body != null ? body.getEvalCount() : null,
                            true
                    );

                } catch (Exception ex) {
                    ModelCompareResult err = new ModelCompareResult();
                    err.setModel(m);
                    err.setSuccess(false);
                    err.setError(ex.getMessage());
                    err.setResponseTimeMs(System.currentTimeMillis() - start);
                    return err;
                }
            });
        }

        List<Future<ModelCompareResult>> futures = executor.invokeAll(tasks);
        executor.shutdown();

        List<ModelCompareResult> results = new ArrayList<>();
        for (Future<ModelCompareResult> f : futures) {
            try {
                results.add(f.get());
            } catch (ExecutionException ex) {
                ModelCompareResult err = new ModelCompareResult();
                err.setSuccess(false);
                err.setError(ex.getMessage());
                results.add(err);
            }
        }

        return results;
    }
}
