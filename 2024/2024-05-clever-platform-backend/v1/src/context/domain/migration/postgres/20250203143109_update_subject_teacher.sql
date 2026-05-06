-- +goose Up
-- +goose StatementBegin
ALTER TABLE "subject"."subject_teacher" ADD CONSTRAINT subject_teacher_teacher_id_academic_year_subject_id_key UNIQUE (teacher_id, academic_year, subject_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "subject"."subject_teacher" DROP CONSTRAINT subject_teacher_teacher_id_academic_year_subject_id_key;
-- +goose StatementEnd
