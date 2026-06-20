import os
import tiktoken
from openai import OpenAI
from .config import TestCase

client = OpenAI(
    base_url="https://neck-seafood-browse-complicated.trycloudflare.com/v1",
    api_key=os.environ.get("OPENAI_API_KEY", "colab-ollama")
)

class PromptEvaluator:
    def __init__(self, eval_model: str, target_budget: int):
        self.eval_model = eval_model
        self.target_budget = target_budget
        self.encoder = tiktoken.get_encoding("cl100k_base")

    def count_tokens(self, text: str) -> int:
        return len(self.encoder.encode(text))

    def judge_score(self, system_prompt: str, user_input: str, criteria: str) -> float:
        try:
            run_response = client.chat.completions.create(
                model=self.eval_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_input}
                ],
                temperature=0.0
            )
            actual_output = run_response.choices[0].message.content.strip()

            judge_prompt = f"You are a QA Judge. Rate the AI Response based ONLY on Criteria.\n\nINPUT: {user_input}\nRESPONSE: {actual_output}\nCRITERIA: {criteria}\n\nFormat strictly:\nSCORE: [float 0.0 to 1.0]\nREASON: [text]"
            
            judge_response = client.chat.completions.create(
                model=self.eval_model,
                messages=[{"role": "user", "content": judge_prompt}],
                temperature=0.0
            )
            judge_verdict = judge_response.choices[0].message.content
            
            for line in judge_verdict.split("\n"):
                if "SCORE:" in line:
                    return float(line.split("SCORE:")[1].strip())
            return 0.0
        except Exception as e:
            print(f"[Judge Error]: {e}")
            return 0.0
