-- +goose Up
-- +goose StatementBegin
ALTER TABLE "teacher_store"."teacher_store_item" ADD COLUMN "limit_per_user" INTEGER;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "teacher_store"."teacher_store_item" DROP COLUMN "limit_per_user";
-- +goose StatementEnd
