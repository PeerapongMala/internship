-- +goose Up
-- +goose StatementBegin
ALTER TABLE "announcement"."announcement_reward_item" ALTER COLUMN "expired_at" DROP NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "announcement"."announcement_reward_item" ALTER COLUMN "expired_at" SET NOT NULL;
-- +goose StatementEnd
