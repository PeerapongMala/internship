-- +goose Up
-- +goose StatementBegin
ALTER TABLE "class"."class" ADD CONSTRAINT "uq_academic_year_year_name" UNIQUE ("academic_year", "year", "name");
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "class"."class" DROP CONSTRAINT "uq_academic_year_year_name";
-- +goose StatementEnd
