-- +goose Up
-- +goose StatementBegin
ALTER TABLE "streak_login"."subject_reward" ADD COLUMN "item_amount" INT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "streak_login"."subject_reward" DROP COLUMN "item_amount";
-- +goose StatementEnd
