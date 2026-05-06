-- +goose Up
-- +goose StatementBegin
ALTER TABLE "school"."school" ADD COLUMN "deputy_director" VARCHAR;
ALTER TABLE "school"."school" ADD COLUMN "deputy_director_phone" VARCHAR;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "school"."school" DROP COLUMN "deputy_director";
ALTER TABLE "school"."school" DROP COLUMN "deputy_director_phone";
-- +goose StatementEnd
