package com.mantra.mantra_api.repository;

import com.mantra.mantra_api.entity.PromptHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PromptHistoryRepository
        extends JpaRepository<PromptHistory, Long> {

    // ─── Existing ────────────────────────────────────────────────────────────────

    @Query("SELECT p.category, COUNT(p) FROM PromptHistory p GROUP BY p.category")
    List<Object[]> getCategoryStats();

    @Query("SELECT AVG(p.score) FROM PromptHistory p")
    Double getAverageScore();

    List<PromptHistory> findTop10ByOrderByCreatedAtDesc();

    List<PromptHistory> findByOriginalPromptContainingIgnoreCase(String keyword);

    // ─── V4 — Prompt Management ──────────────────────────────────────────────────

    List<PromptHistory> findByFavoriteTrue();

    List<PromptHistory> findByTagsContainingIgnoreCase(String tag);

    List<PromptHistory> findByCategoryIgnoreCase(String category);

    @Query("SELECT DISTINCT p.tags FROM PromptHistory p WHERE p.tags IS NOT NULL AND p.tags != ''")
    List<String> findAllTags();

    // ─── Performance Analytics (V3) ──────────────────────────────────────────────

    /** Average response time in nanoseconds */
    @Query("SELECT AVG(p.totalDuration) FROM PromptHistory p WHERE p.totalDuration IS NOT NULL")
    Double getAverageResponseTimeNs();

    /** Fastest prompt response time in nanoseconds */
    @Query("SELECT MIN(p.totalDuration) FROM PromptHistory p WHERE p.totalDuration IS NOT NULL")
    Long getMinResponseTimeNs();

    /** Slowest prompt response time in nanoseconds */
    @Query("SELECT MAX(p.totalDuration) FROM PromptHistory p WHERE p.totalDuration IS NOT NULL")
    Long getMaxResponseTimeNs();

    /** Average token count (eval count) */
    @Query("SELECT AVG(p.evalCount) FROM PromptHistory p WHERE p.evalCount IS NOT NULL")
    Double getAverageTokenCount();

    /** Total tokens generated */
    @Query("SELECT SUM(p.evalCount) FROM PromptHistory p WHERE p.evalCount IS NOT NULL")
    Long getTotalTokenCount();

    /** Usage by model: [model, count] */
    @Query("SELECT p.model, COUNT(p) FROM PromptHistory p WHERE p.model IS NOT NULL GROUP BY p.model")
    List<Object[]> getModelUsageStats();

    /** Average response time by model: [model, avgNs] */
    @Query("SELECT p.model, AVG(p.totalDuration) FROM PromptHistory p WHERE p.model IS NOT NULL AND p.totalDuration IS NOT NULL GROUP BY p.model")
    List<Object[]> getAverageResponseTimeByModel();

    /** Daily prompt volume: [date string, count] */
    @Query("SELECT CAST(p.createdAt AS DATE), COUNT(p) FROM PromptHistory p GROUP BY CAST(p.createdAt AS DATE) ORDER BY CAST(p.createdAt AS DATE)")
    List<Object[]> getDailyPromptVolume();

    /** Score distribution buckets */
    @Query("SELECT " +
            "SUM(CASE WHEN p.score >= 90 THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN p.score >= 70 AND p.score < 90 THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN p.score >= 50 AND p.score < 70 THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN p.score < 50 THEN 1 ELSE 0 END) " +
            "FROM PromptHistory p")
    Object[] getScoreDistribution();
}
