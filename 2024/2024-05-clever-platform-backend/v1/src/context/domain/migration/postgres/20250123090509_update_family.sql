-- +goose Up
-- +goose StatementBegin
ALTER TABLE "family"."family" ADD COLUMN "status" VARCHAR NOT NULL DEFAULT 'enabled';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "family"."family" DROP COLUMN "status";
-- +goose StatementEnd
