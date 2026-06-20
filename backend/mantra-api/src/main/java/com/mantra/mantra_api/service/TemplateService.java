package com.mantra.mantra_api.service;

import com.mantra.mantra_api.dto.PromptTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TemplateService {

    public List<PromptTemplate> getTemplates() {

        return List.of(
                new PromptTemplate(
                        "Coding",
                        "Act as a Senior Software Engineer. Build {feature} using {tech stack}. Include architecture, code, edge cases and testing."
                ),
                new PromptTemplate(
                        "System Design",
                        "Design a scalable {system}. Include HLD, LLD, database, APIs and scaling strategy."
                ),
                new PromptTemplate(


                        "Resume",
                        "Review my resume for {role}. Suggest improvements and ATS optimizations."
                ),
                new PromptTemplate(
                        "Interview",
                        "Act as an interviewer for {role}. Ask questions one by one and evaluate answers."
                ),
                new PromptTemplate(
                        "LinkedIn",
                        "Create a LinkedIn post about {topic}. Make it engaging and professional."
                )
        );
    }
}
