package com.mantra.mantra_api.controller;

import com.mantra.mantra_api.dto.PerformanceStats;
import com.mantra.mantra_api.repository.PromptHistoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final PromptHistoryRepository historyRepository;

    public AnalyticsController(PromptHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    private static long nsToMs(Number ns) {
        if (ns == null) return 0;
        return ns.longValue() / 1_000_000;
    }

    // ─── Performance Summary ─────────────────────────────────────────────────────

    @GetMapping("/performance")
    public PerformanceStats getPerformance() {
        Double avgNs   = historyRepository.getAverageResponseTimeNs();
        Long   minNs   = historyRepository.getMinResponseTimeNs();
        Long   maxNs   = historyRepository.getMaxResponseTimeNs();
        Double avgTok  = historyRepository.getAverageTokenCount();
        Long   totTok  = historyRepository.getTotalTokenCount();
        long   total   = historyRepository.count();

        return new PerformanceStats(
                nsToMs(avgNs),
                nsToMs(minNs),
                nsToMs(maxNs),
                avgTok != null ? avgTok : 0,
                totTok != null ? totTok : 0,
                total
        );
    }

    // ─── Model Usage ─────────────────────────────────────────────────────────────

    @GetMapping("/models")
    public List<Map<String, Object>> getModelUsage() {
        List<Map<String, Object>> result = new ArrayList<>();
        historyRepository.getModelUsageStats().forEach(row -> {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("model", row[0]);
            entry.put("count", ((Number) row[1]).longValue());
            result.add(entry);
        });
        historyRepository.getAverageResponseTimeByModel().forEach(row -> {
            String model = (String) row[0];
            long avgMs   = nsToMs((Number) row[1]);
            result.stream()
                    .filter(e -> model.equals(e.get("model")))
                    .findFirst()
                    .ifPresent(e -> e.put("avgResponseTimeMs", avgMs));
        });
        return result;
    }

    // ─── Daily Volume ────────────────────────────────────────────────────────────

    @GetMapping("/volume")
    public List<Map<String, Object>> getDailyVolume() {
        List<Map<String, Object>> result = new ArrayList<>();
        historyRepository.getDailyPromptVolume().forEach(row -> {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("date", row[0] != null ? row[0].toString() : "unknown");
            entry.put("count", ((Number) row[1]).longValue());
            result.add(entry);
        });
        return result;
    }

    // ─── Score Distribution ──────────────────────────────────────────────────────

    @GetMapping("/scores")
    public Map<String, Object> getScoreDistribution() {
        Object[] buckets = historyRepository.getScoreDistribution();
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("excellent", buckets[0] != null ? ((Number) buckets[0]).longValue() : 0);
        result.put("good",      buckets[1] != null ? ((Number) buckets[1]).longValue() : 0);
        result.put("fair",      buckets[2] != null ? ((Number) buckets[2]).longValue() : 0);
        result.put("poor",      buckets[3] != null ? ((Number) buckets[3]).longValue() : 0);
        return result;
    }
}
