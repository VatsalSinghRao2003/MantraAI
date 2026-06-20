package com.mantra.mantra_api.repository;

import com.mantra.mantra_api.entity.PromptHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PromptHistoryRepository
        extends JpaRepository<PromptHistory, Long> {



@Query("""
SELECT p.category, COUNT(p)
FROM PromptHistory p
GROUP BY p.category
""")
List<Object[]> getCategoryStats();

    @Query("SELECT AVG(p.score) FROM PromptHistory p")
    Double getAverageScore();

    List<PromptHistory> findTop10ByOrderByCreatedAtDesc();

    List<PromptHistory> findByOriginalPromptContainingIgnoreCase(
            String keyword);
}
