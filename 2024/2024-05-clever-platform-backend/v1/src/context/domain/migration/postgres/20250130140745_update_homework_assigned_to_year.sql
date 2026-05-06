-- +goose Up
-- +goose StatementBegin
ALTER TABLE "homework"."homework_assigned_to_year" DROP COLUMN "year_id";
ALTER TABLE "homework"."homework_assigned_to_year" ADD COLUMN "seed_year_id" INT REFERENCES "curriculum_group"."seed_year" ("id");
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "homework"."homework_assigned_to_year" DROP COLUMN "seed_year_id";
ALTER TABLE "homework"."homework_assigned_to_year" ADD COLUMN "year_id" INT REFERENCES "curriculum_group"."year" ("id");
-- +goose StatementEnd
