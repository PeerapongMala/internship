-- +goose Up
-- +goose StatementBegin
ALTER TABLE "grade"."evaluation_form_setting" ADD COLUMN "level_count" INT;
ALTER TABLE "grade"."template_assessment_setting" ADD COLUMN "level_count" INT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "grade"."evaluation_form_setting" DROP COLUMN "level_count";
ALTER TABLE "grade"."template_assessment_setting" DROP COLUMN "level_count";
-- +goose StatementEnd
