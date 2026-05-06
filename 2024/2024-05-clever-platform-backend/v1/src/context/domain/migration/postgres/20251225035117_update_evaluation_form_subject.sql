-- +goose Up
-- +goose StatementBegin
ALTER TABLE "grade"."evaluation_form_subject" ADD COLUMN "subject_name" VARCHAR;
ALTER TABLE "grade"."evaluation_form_subject" ADD COLUMN "is_clever" BOOLEAN;
ALTER TABLE "grade"."evaluation_form_subject" ADD COLUMN "clever_subject_id" INT;
ALTER TABLE "grade"."evaluation_form_subject" ADD COLUMN "hours" INT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "grade"."evaluation_form_subject" DROP COLUMN "subject_name";
ALTER TABLE "grade"."evaluation_form_subject" DROP COLUMN "is_clever";
ALTER TABLE "grade"."evaluation_form_subject" DROP COLUMN "clever_subject_id";
ALTER TABLE "grade"."evaluation_form_subject" DROP COLUMN "hours";
-- +goose StatementEnd
