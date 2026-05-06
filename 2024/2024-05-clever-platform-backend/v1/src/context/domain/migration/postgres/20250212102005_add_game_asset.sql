-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS "game"."game_asset" (
    "model_id" VARCHAR PRIMARY KEY,
    "url" VARCHAR NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS "game"."game_asset";
-- +goose StatementEnd
