package com.mantra.mantra_api.dto;

public class BenchmarkResponse {

    private int prompt1Score;
    private int prompt2Score;

    private int prompt1Length;
    private int prompt2Length;

    private String winner;

    public BenchmarkResponse(
            int prompt1Score,
            int prompt2Score,
            int prompt1Length,
            int prompt2Length,
            String winner) {

        this.prompt1Score = prompt1Score;
        this.prompt2Score = prompt2Score;
        this.prompt1Length = prompt1Length;
        this.prompt2Length = prompt2Length;
        this.winner = winner;
    }

    public int getPrompt1Score() {
        return prompt1Score;
    }

    public int getPrompt2Score() {
        return prompt2Score;
    }

    public int getPrompt1Length() {
        return prompt1Length;
    }

    public int getPrompt2Length() {
        return prompt2Length;
    }

    public String getWinner() {
        return winner;
    }
}
