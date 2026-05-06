-- +goose Up
-- +goose StatementBegin
ALTER TABLE "homework"."homework_assigned_to_year" ADD COLUMN "assigned_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;;
ALTER TABLE "homework"."homework_assigned_to_class" ADD COLUMN "assigned_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;;
ALTER TABLE "homework"."homework_assigned_to_study_group" ADD COLUMN "assigned_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "homework"."homework_assigned_to_year" DROP COLUMN "assigned_at";
ALTER TABLE "homework"."homework_assigned_to_class" DROP COLUMN "assigned_at";
ALTER TABLE "homework"."homework_assigned_to_study_group" DROP COLUMN "assigned_at";
-- +goose StatementEnd
