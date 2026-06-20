from pydantic import BaseModel, Field

class TestCase(BaseModel):
    input_text: str = Field(..., description="The user input provided to the prompt being tested.")
    expected_criteria: str = Field(..., description="The strict criteria or ground truth the response must satisfy.")

class MantraModelConfig(BaseModel):
    target_token_budget: int = 80
    max_iterations: int = 3
    eval_model: str = "gpt-4o-mini"
    optimizer_model: str = "gpt-4o"
