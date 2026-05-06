-- +goose Up
-- +goose StatementBegin
ALTER TABLE "grade"."evaluation_form_subject" ADD COLUMN "clever_subject_template_id" INT;
ALTER TABLE "grade"."evaluation_form_indicator" ADD COLUMN "clever_subject_template_indicator_id" INT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "grade"."evaluation_form_subject" DROP COLUMN "clever_subject_template_id";
ALTER TABLE "grade"."evaluation_form_indicator" DROP COLUMN "clever_subject_template_indicator_id";
-- +goose StatementEnd
