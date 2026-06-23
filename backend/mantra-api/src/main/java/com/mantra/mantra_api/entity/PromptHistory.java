package com.mantra.mantra_api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prompt_history")
public class PromptHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 5000)
    private String originalPrompt;

    @Column(length = 10000)
    private String optimizedPrompt;

    private Integer score;

    private String category;

    private LocalDateTime createdAt;

    // AI Metrics (V3)
    private Long totalDuration;
    private Long loadDuration;
    private Integer promptEvalCount;
    private Integer evalCount;
    private String model;

    // Prompt Management (V4)
    private Boolean favorite = false;

    @Column(length = 1000)
    private String tags;           // comma-separated: "java,spring,rest"

    private Integer version = 1;   // prompt version number
    private Long userId;
    private Long workspaceId;


    public PromptHistory() {}

    // ─── Getters / Setters ───────────────────────────────────────────────────────

    public Long getId() { return id; }

    public String getOriginalPrompt() { return originalPrompt; }
    public void setOriginalPrompt(String v) { this.originalPrompt = v; }

    public String getOptimizedPrompt() { return optimizedPrompt; }
    public void setOptimizedPrompt(String v) { this.optimizedPrompt = v; }

    public Integer getScore() { return score; }
    public void setScore(Integer v) { this.score = v; }

    public String getCategory() { return category; }
    public void setCategory(String v) { this.category = v; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }

    public Long getTotalDuration() { return totalDuration; }
    public void setTotalDuration(Long v) { this.totalDuration = v; }

    public Long getLoadDuration() { return loadDuration; }
    public void setLoadDuration(Long v) { this.loadDuration = v; }

    public Integer getPromptEvalCount() { return promptEvalCount; }
    public void setPromptEvalCount(Integer v) { this.promptEvalCount = v; }

    public Integer getEvalCount() { return evalCount; }
    public void setEvalCount(Integer v) { this.evalCount = v; }

    public String getModel() { return model; }
    public void setModel(String v) { this.model = v; }

    public Boolean getFavorite() { return favorite != null && favorite; }
    public void setFavorite(Boolean v) { this.favorite = v; }

    public String getTags() { return tags; }
    public void setTags(String v) { this.tags = v; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer v) { this.version = v; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getWorkspaceId() { return workspaceId; }
    public void setWorkspaceId(Long workspaceId) { this.workspaceId = workspaceId; }
}