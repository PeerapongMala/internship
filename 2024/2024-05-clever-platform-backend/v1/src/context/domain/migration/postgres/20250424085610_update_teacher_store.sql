-- +goose Up
-- +goose StatementBegin
ALTER TABLE "teacher_store"."teacher_store" ADD CONSTRAINT "uq_subject_id_teacher_id" UNIQUE ("subject_id", "teacher_id");
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "teacher_store"."teacher_store" DROP CONSTRAINT "uq_subject_id_teacher_id";
-- +goose StatementEnd