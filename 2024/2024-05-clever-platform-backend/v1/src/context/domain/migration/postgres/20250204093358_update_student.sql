-- +goose Up
-- +goose StatementBegin
ALTER TABLE "user"."student" DROP CONSTRAINT "student_student_id_key";
ALTER TABLE "curriculum_group"."platform" ADD CONSTRAINT "platform_curriculum_group_id_seed_platform_id_key" UNIQUE ("curriculum_group_id", "seed_platform_id");
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "user"."student" ADD CONSTRAINT "student_student_id_key" UNIQUE ("student_id");
ALTER TABLE "curriculum_group"."platform" DROP CONSTRAINT "platform_curriculum_group_id_seed_platform_id_key";
-- +goose StatementEnd
