-- +goose Up
-- +goose StatementBegin
ALTER TABLE "user"."student" ADD CONSTRAINT "uq_school_id_student_id" UNIQUE ("school_id", "student_id");
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "user"."student" DROP CONSTRAINT "uq_school_id_student_id";
-- +goose StatementEnd
