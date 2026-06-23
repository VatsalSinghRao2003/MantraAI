CREATE TABLE prompt_collection (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT
);

CREATE TABLE prompt_collection_history (
    collection_id BIGINT NOT NULL,
    prompt_history_id BIGINT NOT NULL,
    PRIMARY KEY (collection_id, prompt_history_id)
);
