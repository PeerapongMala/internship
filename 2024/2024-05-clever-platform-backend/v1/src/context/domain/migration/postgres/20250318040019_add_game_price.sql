-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS "game"."shop_price"
(
    "model_id"      VARCHAR PRIMARY KEY,
    "price"         INT NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS "game"."shop_price";
-- +goose StatementEnd
