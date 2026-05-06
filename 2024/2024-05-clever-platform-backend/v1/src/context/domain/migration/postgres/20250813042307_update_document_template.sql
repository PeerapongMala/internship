-- +goose Up
-- +goose StatementBegin
ALTER TABLE "grade"."document_template" ADD COLUMN "is_default" BOOLEAN;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "grade"."document_template" DROP COLUMN "is_default";
-- +goose StatementEnd
