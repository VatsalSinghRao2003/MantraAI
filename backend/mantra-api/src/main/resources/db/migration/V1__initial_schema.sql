CREATE TABLE prompt_history (
    id BIGSERIAL PRIMARY KEY,
    original_prompt VARCHAR(5000),
    optimized_prompt VARCHAR(10000),
    score INTEGER,
    category VARCHAR(255),
    created_at TIMESTAMP,
    total_duration BIGINT,
    load_duration BIGINT,
    prompt_eval_count INTEGER,
    eval_count INTEGER,
    model VARCHAR(255),
    favorite BOOLEAN DEFAULT FALSE,
    tags VARCHAR(1000),
    version INTEGER
);
