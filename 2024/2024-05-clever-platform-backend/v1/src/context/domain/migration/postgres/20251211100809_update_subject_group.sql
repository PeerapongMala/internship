-- +goose Up
-- +goose StatementBegin
ALTER TABLE "curriculum_group"."subject_group" ADD COLUMN "full_option" BOOLEAN;
ALTER TABLE "curriculum_group"."subject_group" ADD COLUMN "theme" VARCHAR;
ALTER TABLE "curriculum_group"."subject_group" ADD COLUMN "url" VARCHAR;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "curriculum_group"."subject_group" DROP COLUMN "full_option";
ALTER TABLE "curriculum_group"."subject_group" DROP COLUMN "theme";
ALTER TABLE "curriculum_group"."subject_group" DROP COLUMN "url";
-- +goose StatementEnd
