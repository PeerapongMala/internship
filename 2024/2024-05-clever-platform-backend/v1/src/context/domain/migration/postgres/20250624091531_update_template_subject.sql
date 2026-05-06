-- +goose Up
-- +goose StatementBegin
ALTER TABLE "grade"."template_subject" ADD COLUMN "subject_no" VARCHAR;
ALTER TABLE "grade"."template_subject" ADD COLUMN "learning_area" VARCHAR;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "grade"."template_subject" DROP COLUMN "subject_no";
ALTER TABLE "grade"."template_subject" DROP COLUMN "learning_area";
-- +goose StatementEnd
