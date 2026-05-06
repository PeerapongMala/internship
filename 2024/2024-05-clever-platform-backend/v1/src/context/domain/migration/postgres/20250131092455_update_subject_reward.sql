-- +goose Up
-- +goose StatementBegin
ALTER TABLE "streak_login"."subject_reward" ADD COLUMN "tier" INT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "streak_login"."subject_reward" DROP "tier";
-- +goose StatementEnd
