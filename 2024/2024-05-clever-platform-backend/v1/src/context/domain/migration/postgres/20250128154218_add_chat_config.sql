-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS "message"."chat_config" (
    "chat_level" VARCHAR PRIMARY KEY,
    "is_enabled" BOOLEAN
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS "message"."chat_config";
-- +goose StatementEnd
