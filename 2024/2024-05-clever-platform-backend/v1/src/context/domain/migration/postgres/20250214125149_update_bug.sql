-- +goose Up
-- +goose StatementBegin
ALTER TABLE "bug"."bug_report"
DROP COLUMN "device_id",
DROP COLUMN "image_url",
ADD COLUMN "os" VARCHAR,
ADD COLUMN "url" VARCHAR;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "bug"."bug_report"
DROP COLUMN "os",
DROP COLUMN "url",
ADD COLUMN "device_id" VARCHAR,
ADD COLUMN "image_url" VARCHAR;
-- +goose StatementEnd
