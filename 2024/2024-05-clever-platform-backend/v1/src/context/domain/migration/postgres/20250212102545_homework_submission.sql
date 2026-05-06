-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS "homework"."homework_submission" (
    "level_play_log_id" INT PRIMARY KEY REFERENCES "level"."level_play_log" ("id"),
    "index" INT
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS "homework"."homework_submission";
-- +goose StatementEnd
