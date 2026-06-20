import os
from typing import List, Dict, Any
from openai import OpenAI
from .config import TestCase, MantraModelConfig
from .evaluators import PromptEvaluator

client = OpenAI(
    base_url="https://neck-seafood-browse-complicated.trycloudflare.com/v1",
    api_key=os.environ.get("OPENAI_API_KEY", "colab-ollama")
)

class MantraModel:
    def __init__(self, config: MantraModelConfig):
        self.config = config
        self.evaluator = PromptEvaluator(config.eval_model, config.target_token_budget)

    def evaluate_candidate(self, prompt: str, dataset: List[TestCase]) -> Dict[str, Any]:
        total_score = 0.0
        token_count = self.evaluator.count_tokens(prompt)
        for case in dataset:
            total_score += self.evaluator.judge_score(prompt, case.input_text, case.expected_criteria)
        base_accuracy = total_score / len(dataset) if dataset else 0.0
        if token_count > self.config.target_token_budget:
            excess_chunks = (token_count - self.config.target_token_budget) / 10
            fitness_score = max(0.0, base_accuracy - (excess_chunks * 0.05))
        elif token_count < 45:
            structural_deficit = (45 - token_count) * 0.015
            fitness_score = max(0.0, base_accuracy - structural_deficit)
        else:
            bonus = (self.config.target_token_budget - token_count) * 0.0005
            fitness_score = min(1.0, base_accuracy + bonus)
        return {"accuracy": base_accuracy, "token_count": token_count, "fitness_score": fitness_score}

    def optimize(self, seed_prompt: str, dataset: List[TestCase]) -> str:
        current_prompt = seed_prompt
        best_prompt = seed_prompt
        best_score = -1.0
        print(f"MantraModel Active: Optimizing across endpoint to {self.config.target_token_budget} tokens max")
        for iteration in range(1, self.config.max_iterations + 1):
            metrics = self.evaluate_candidate(current_prompt, dataset)
            print(f"Iteration {iteration} | Fitness Score: {metrics['fitness_score']:.3f} | Current Tokens: {metrics['token_count']}")
            if metrics["fitness_score"] > best_score:
                best_score = metrics["fitness_score"]
                best_prompt = current_prompt
            meta_prompt = f"You are a system prompt engineering optimizer. Transform the user's raw, vague request into a highly optimized, comprehensive master system instruction prompt layout.\n\nTARGET BUDGET: {self.config.target_token_budget} tokens.\nCURRENT INPUT PROMPT: \"{current_prompt}\"\n\nCRITICAL EXPANSION INSTRUCTIONS:\nThe optimized prompt MUST instruct an LLM to act as an expert and construct a comprehensive blueprint detailing:\n- System Goals & Target Audience\n- Explicit User Personas & Roles\n- Core Functional Engineering Requirements\n- Recommended Technology Stack & Architecture\n- Complete Database Schemas & API Contracts\n- Deployment, Security, & Scalability Plans\n\nCOMPRESSION RULE:\nOutput ONLY the optimized prompt content without pleasantries or codeblock wrappers."
            try:
                response = client.chat.completions.create(model=self.config.optimizer_model, messages=[{"role": "user", "content": meta_prompt}], temperature=0.4)
                current_prompt = response.choices[0].message.content.strip()
            except Exception as e:
                print(f"Tunnel Transmission Error: {e}"); break
        return best_prompt
