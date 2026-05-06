-- +goose Up
-- +goose StatementBegin
ALTER TABLE "school_affiliation"."school_affiliation_school" ADD CONSTRAINT "uq_school_id" UNIQUE ("school_id");
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "school_affiliation"."school_affiliation_school" DROP CONSTRAINT "uq_school_id";
-- +goose StatementEnd
