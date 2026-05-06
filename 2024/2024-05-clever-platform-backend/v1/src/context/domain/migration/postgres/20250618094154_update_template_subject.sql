-- +goose Up
-- +goose StatementBegin
ALTER TABLE "grade"."template_subject" ADD COLUMN "clever_subject_template_id" INT;
ALTER TABLE "grade"."template_indicator" ADD COLUMN "clever_subject_template_indicator_id" INT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "grade"."template_subject" DROP COLUMN "clever_subject_template_id";
ALTER TABLE "grade"."template_indicator" DROP COLUMN "clever_subject_template_indicator_id";
-- +goose StatementEnd
