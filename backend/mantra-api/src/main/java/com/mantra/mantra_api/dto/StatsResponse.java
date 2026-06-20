package com.mantra.mantra_api.dto;

public class StatsResponse {

    private long totalPrompts;
    private double averageScore;

    public StatsResponse(long totalPrompts, double averageScore) {
        this.totalPrompts = totalPrompts;
        this.averageScore = averageScore;
    }

    public long getTotalPrompts() {
        return totalPrompts;
    }

    public double getAverageScore() {
        return averageScore;
    }
}
