from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from LLM import MantraModel, MantraModelConfig, TestCase

app = FastAPI(title="MantraAI Prompt Optimization API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OptimizeRequest(BaseModel):
    raw_prompt: str
    target_budget: int = 600

class OptimizeResponse(BaseModel):
    original_prompt: str
    optimized_prompt: str
    original_tokens: int
    optimized_tokens: int

@app.post("/api/optimize", response_model=OptimizeResponse)
async def optimize_prompt_endpoint(request: OptimizeRequest):
    try:
        config = MantraModelConfig(
            target_token_budget=request.target_budget,
            max_iterations=2,
            eval_model="llama3.2:latest",
            optimizer_model="llama3.2:latest"
        )
        model = MantraModel(config)

        dataset = [
            TestCase(
                input_text=request.raw_prompt,
                expected_criteria="The output must provide dense, structured engineering or system requirements."
            )
        ]

        orig_tokens = model.evaluator.count_tokens(request.raw_prompt)
        optimized_text = model.optimize(request.raw_prompt, dataset)
        opt_tokens = model.evaluator.count_tokens(optimized_text)

        return {
            "original_prompt": request.raw_prompt,
            "optimized_prompt": optimized_text,
            "original_tokens": orig_tokens,
            "optimized_tokens": opt_tokens
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
