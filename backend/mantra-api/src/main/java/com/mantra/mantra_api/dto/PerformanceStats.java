package com.mantra.mantra_api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PerformanceStats {

    @JsonProperty("avgResponseTimeMs")
    private long avgResponseTimeMs;

    @JsonProperty("minResponseTimeMs")
    private long minResponseTimeMs;

    @JsonProperty("maxResponseTimeMs")
    private long maxResponseTimeMs;

    @JsonProperty("avgTokenCount")
    private double avgTokenCount;

    @JsonProperty("totalTokenCount")
    private long totalTokenCount;

    @JsonProperty("totalPrompts")
    private long totalPrompts;

    public PerformanceStats() {}

    public PerformanceStats(long avgResponseTimeMs, long minResponseTimeMs,
                            long maxResponseTimeMs, double avgTokenCount,
                            long totalTokenCount, long totalPrompts) {
        this.avgResponseTimeMs = avgResponseTimeMs;
        this.minResponseTimeMs = minResponseTimeMs;
        this.maxResponseTimeMs = maxResponseTimeMs;
        this.avgTokenCount = avgTokenCount;
        this.totalTokenCount = totalTokenCount;
        this.totalPrompts = totalPrompts;
    }

    public long getAvgResponseTimeMs() { return avgResponseTimeMs; }
    public void setAvgResponseTimeMs(long v) { this.avgResponseTimeMs = v; }

    public long getMinResponseTimeMs() { return minResponseTimeMs; }
    public void setMinResponseTimeMs(long v) { this.minResponseTimeMs = v; }

    public long getMaxResponseTimeMs() { return maxResponseTimeMs; }
    public void setMaxResponseTimeMs(long v) { this.maxResponseTimeMs = v; }

    public double getAvgTokenCount() { return avgTokenCount; }
    public void setAvgTokenCount(double v) { this.avgTokenCount = v; }

    public long getTotalTokenCount() { return totalTokenCount; }
    public void setTotalTokenCount(long v) { this.totalTokenCount = v; }

    public long getTotalPrompts() { return totalPrompts; }
    public void setTotalPrompts(long v) { this.totalPrompts = v; }
}
