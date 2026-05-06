-- +goose Up
-- +goose StatementBegin
ALTER TABLE "school"."school" DROP CONSTRAINT "uq_name";
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "school"."school" ADD CONSTRAINT "uq_name" UNIQUE ("name");
-- +goose StatementEnd
