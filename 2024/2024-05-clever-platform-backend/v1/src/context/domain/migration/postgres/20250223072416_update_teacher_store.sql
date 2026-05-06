-- +goose Up
-- +goose StatementBegin
ALTER TABLE "teacher_store"."teacher_store_item" ALTER COLUMN "teacher_store_id" DROP NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "teacher_store"."teacher_store_item" ALTER COLUMN "teacher_store_id" SET NOT NULL;
-- +goose StatementEnd
