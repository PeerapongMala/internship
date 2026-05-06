-- +goose Up
-- +goose StatementBegin
ALTER TABLE "school_affiliation"."school_affiliation" ADD CONSTRAINT "uq_name" UNIQUE ("name");
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "school_affiliation"."school_affiliation" DROP CONSTRAINT "uq_name";
-- +goose StatementEnd
