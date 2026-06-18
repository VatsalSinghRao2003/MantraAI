package com.mantra.mantra_api.service;

import org.springframework.stereotype.Service;

@Service
public class OptimizerService {
public String optimize(String prompt) {

    return """
            Act as a Senior Software Engineer.

            Task:
            %s

            Requirements:
            - Provide detailed explanation
            - Include best practices
            - Include examples

            Output Format:
            - Step-by-step response
            - Final summary
            """.formatted(prompt);
}

}
