-- +goose Up
-- +goose StatementBegin
ALTER TABLE "level"."level_unlocked_for_student" ADD COLUMN "class_id" INT REFERENCES "class"."class" ("id");
ALTER TABLE "level"."level_unlocked_for_student" DROP CONSTRAINT level_unlocked_for_student_pkey;
ALTER TABLE "level"."level_unlocked_for_student" ADD CONSTRAINT level_unlocked_for_student_pkey PRIMARY KEY ("level_id", "student_id", "class_id");

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "level"."level_unlocked_for_student" DROP "class_id";
ALTER TABLE "level"."level_unlocked_for_student" ADD CONSTRAINT level_unlocked_for_student_pkey PRIMARY KEY ("level_id", "student_id");
-- +goose StatementEnd
