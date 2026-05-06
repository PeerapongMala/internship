-- +goose Up
-- +goose StatementBegin
ALTER TABLE "class"."class" DROP CONSTRAINT "uq_academic_year_year_name";
ALTER TABLE "class"."class" ADD CONSTRAINT "uq_school_id_academic_year_year_name"
UNIQUE ("school_id", "academic_year", "year", "name");
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "class"."class" DROP CONSTRAINT "uq_school_id_academic_year_year_name";
ALTER TABLE "class"."class" ADD CONSTRAINT "uq_academic_year_year_name"
UNIQUE ("academic_year", "year", "name");
-- +goose StatementEnd
