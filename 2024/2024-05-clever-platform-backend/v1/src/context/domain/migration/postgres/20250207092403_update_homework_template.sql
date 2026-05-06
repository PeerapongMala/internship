-- +goose Up
-- +goose StatementBegin
ALTER TABLE "homework"."homework_template" ADD COLUMN "name" VARCHAR NOT NULL DEFAULT '';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "homework"."homework_template" DROP COLUMN "name";
-- +goose StatementEnd
