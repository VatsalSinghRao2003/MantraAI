CREATE TABLE workspace (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    owner_id BIGINT
);

CREATE TABLE prompt_library (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    prompt_text VARCHAR(10000) NOT NULL,
    category VARCHAR(255),
    is_public BOOLEAN DEFAULT FALSE,
    workspace_id BIGINT,
    author_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE prompt_history ADD COLUMN workspace_id BIGINT;
ALTER TABLE prompt_collection ADD COLUMN workspace_id BIGINT;
