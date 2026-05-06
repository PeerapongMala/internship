-- +goose Up
-- +goose StatementBegin
ALTER TABLE "message"."messages" RENAME COLUMN "create_at" TO "created_at";
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "message"."messages" RENAME COLUMN "created_at" TO "create_at";
-- +goose StatementEnd
