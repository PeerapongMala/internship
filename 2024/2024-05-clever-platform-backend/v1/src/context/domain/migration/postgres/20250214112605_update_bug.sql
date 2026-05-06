-- +goose Up
-- +goose StatementBegin
ALTER TABLE "bug"."bug_report" ADD COLUMN "browser" VARCHAR;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "bug"."bug_report" DROP COLUMN "browser";
-- +goose StatementEnd
