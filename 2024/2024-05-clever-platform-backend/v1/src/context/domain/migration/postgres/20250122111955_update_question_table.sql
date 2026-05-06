-- +goose Up
-- +goose StatementBegin
ALTER TABLE "question"."question_multiple_choice" ALTER COLUMN "use_sound_description_only" DROP NOT NULL;
ALTER TABLE "question"."question_sort" ALTER COLUMN "use_sound_description_only" DROP NOT NULL;
ALTER TABLE "question"."question_group" ADD COLUMN "use_sound_description_only" BOOLEAN;
ALTER TABLE "question"."question_placeholder" ADD COLUMN "use_sound_description_only" BOOLEAN;
ALTER TABLE "question"."question_input" ADD COLUMN "use_sound_description_only" BOOLEAN;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "question"."question_multiple_choice" ALTER COLUMN "use_sound_description_only" SET NOT NULL;
ALTER TABLE "question"."question_sort" ALTER COLUMN "use_sound_description_only" SET NOT NULL;
ALTER TABLE "question"."question_group" DROP COLUMN "use_sound_description_only";
ALTER TABLE "question"."question_placeholder" DROP COLUMN "use_sound_description_only";
ALTER TABLE "question"."question_input" DROP COLUMN "use_sound_description_only";
-- +goose StatementEnd
