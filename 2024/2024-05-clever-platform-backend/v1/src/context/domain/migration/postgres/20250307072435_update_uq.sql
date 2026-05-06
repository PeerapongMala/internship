-- +goose Up
-- +goose StatementBegin
ALTER TABLE "school"."school"
ADD CONSTRAINT "school_name_uq" UNIQUE ("name");

ALTER TABLE "school_affiliation"."school_affiliation"
ADD CONSTRAINT "school_affiliation_name_uq" UNIQUE ("name");

ALTER TABLE "curriculum_group"."curriculum_group"
ADD CONSTRAINT "curriculum_group_name_uq" UNIQUE ("name");

ALTER TABLE "user"."user"
ADD CONSTRAINT "user_id_number_uq" UNIQUE ("id_number");

-- +goose StatementEnd
ALTER TABLE "school"."school"
DROP CONSTRAINT IF EXISTS "school_name_uq";

ALTER TABLE "school_affiliation"."school_affiliation"
DROP CONSTRAINT IF EXISTS "school_affiliation_name_uq";

ALTER TABLE "curriculum_group"."curriculum_group"
DROP CONSTRAINT IF EXISTS "curriculum_group_name_uq";

ALTER TABLE "user"."user"
DROP CONSTRAINT IF EXISTS "user_id_number_uq";

-- +goose Down
-- +goose StatementBegin
-- +goose StatementEnd
