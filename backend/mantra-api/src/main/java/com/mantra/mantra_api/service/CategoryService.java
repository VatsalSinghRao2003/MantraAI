package com.mantra.mantra_api.service;

import org.springframework.stereotype.Service;

@Service
public class CategoryService {

    public String detectCategory(String prompt) {

        String text = prompt.toLowerCase();

        if (text.contains("java")
                || text.contains("spring")
                || text.contains("api")
                || text.contains("code")) {

            return "Coding";
        }

        if (text.contains("marketing")
                || text.contains("linkedin")
                || text.contains("instagram")) {

            return "Marketing";
        }

        return "General";
    }
}
