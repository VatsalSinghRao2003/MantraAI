package com.mantra.mantra_api.service;

import org.springframework.stereotype.Service;

@Service
public class ScoreService {

public int calculateScore(String prompt) {

    int score = 50;

    if (prompt.length() > 20) {
        score += 10;
    }

    if (prompt.toLowerCase().contains("role")) {
        score += 10;
    }

    if (prompt.toLowerCase().contains("output")) {
        score += 10;
    }

    return Math.min(score, 100);
}

}
