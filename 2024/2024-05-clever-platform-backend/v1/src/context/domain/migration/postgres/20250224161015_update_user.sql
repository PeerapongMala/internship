-- +goose Up
-- +goose StatementBegin
ALTER TABLE "user"."user" ALTER COLUMN "email" DROP NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "user"."user" ALTER COLUMN "email" SET NOT NULL;
-- +goose StatementEnd
