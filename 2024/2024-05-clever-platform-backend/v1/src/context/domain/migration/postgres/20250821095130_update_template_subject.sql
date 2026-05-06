-- +goose Up
-- +goose StatementBegin
ALTER TABLE "grade"."template_subject" ADD COLUMN "credits" FLOAT;
ALTER TABLE "grade"."template_subject" ADD COLUMN "is_extra" BOOLEAN;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "grade"."template_subject" DROP COLUMN "credits";
ALTER TABLE "grade"."template_subject" DROP COLUMN "is_extra";
-- +goose StatementEnd
