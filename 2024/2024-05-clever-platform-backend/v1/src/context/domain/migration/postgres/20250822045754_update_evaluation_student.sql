-- +goose Up
-- +goose StatementBegin
ALTER TABLE "grade"."evaluation_student" ADD COLUMN "is_out" BOOLEAN;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "grade"."evaluation_student" DROP COLUMN "is_out";
-- +goose StatementEnd
