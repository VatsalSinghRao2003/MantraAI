from LLM import MantraModel, MantraModelConfig, TestCase

TARGET_MODEL = "llama3.2:latest" 

# Raising the budget to 600 tokens to accommodate detailed structural expansion
config = MantraModelConfig(
    target_token_budget=600,  
    max_iterations=2,
    eval_model=TARGET_MODEL,       
    optimizer_model=TARGET_MODEL  
)
model = MantraModel(config)

dataset = [
    TestCase(
        input_text="I want to build an application using AI and travel data.",
        expected_criteria="Output must establish target design layers, business objectives, architecture tech stack, and API guidelines."
    )
]

ultimate_stress_test_prompt = "I want to create something related to travel and AI."

print(f"🧪 Connecting to Google Colab Tunnel using model: {TARGET_MODEL} (Budget: 600)...")
optimized_prompt = model.optimize(ultimate_stress_test_prompt, dataset)

print("\n" + "="*50 + "\n🏆 OPTIMIZED OUTPUT FROM COLAB ENGINE:\n" + "="*50)
print(optimized_prompt)
