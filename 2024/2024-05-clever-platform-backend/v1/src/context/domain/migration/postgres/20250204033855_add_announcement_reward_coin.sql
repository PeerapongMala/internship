-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS "announcement"."announcement_reward_coin"
(
    "announcement_reward_id" INT NOT NULL REFERENCES "announcement"."announcement_reward" ("announcement_id"),
    "gold_coin_amount" INT,
    "arcade_coin_amount" INT,
    "ice_amount" INT
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS "announcement"."announcement_reward_coin";
-- +goose StatementEnd
