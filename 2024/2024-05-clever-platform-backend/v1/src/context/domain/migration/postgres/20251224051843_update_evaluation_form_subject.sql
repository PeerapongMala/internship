-- +goose Up
-- +goose StatementBegin
ALTER TABLE "grade"."evaluation_form_subject" ADD COLUMN "subject_no" VARCHAR;
ALTER TABLE "grade"."evaluation_form_subject" ADD COLUMN "learning_area" VARCHAR;
ALTER TABLE "grade"."evaluation_form_subject" ADD COLUMN "credits" FLOAT;
ALTER TABLE "grade"."evaluation_form_subject" ADD COLUMN "is_extra" BOOLEAN;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "grade"."evaluation_form_subject" DROP COLUMN "subject_no";
ALTER TABLE "grade"."evaluation_form_subject" DROP COLUMN "learning_area";
ALTER TABLE "grade"."evaluation_form_subject" DROP COLUMN "credits";
ALTER TABLE "grade"."evaluation_form_subject" DROP COLUMN "is_extra";
-- +goose StatementEnd
