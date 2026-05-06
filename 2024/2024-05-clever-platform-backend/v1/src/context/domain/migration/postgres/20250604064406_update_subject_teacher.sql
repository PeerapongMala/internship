-- +goose Up
-- +goose StatementBegin
ALTER TABLE "subject"."subject_teacher" ADD CONSTRAINT "uq_subject_id_teacher_id" UNIQUE ("subject_id", "teacher_id");
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "subject"."subject_teacher" DROP CONSTRAINT "uq_subject_id_teacher_id";
-- +goose StatementEnd
