-- +goose Up
-- +goose StatementBegin
ALTER TABLE "grade"."indicator_level_setting" ADD COLUMN "level_count" INT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "grade"."indicator_level_setting" DROP COLUMN "level_count";
-- +goose StatementEnd
