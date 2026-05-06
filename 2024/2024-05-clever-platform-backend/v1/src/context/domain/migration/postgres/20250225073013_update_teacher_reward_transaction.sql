-- +goose Up
-- +goose StatementBegin
ALTER TABLE "teacher_item"."teacher_reward_transaction" ADD COLUMN "is_deleted" BOOLEAN;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "teacher_item"."teacher_reward_transaction" DROP COLUMN "is_deleted";
-- +goose StatementEnd
