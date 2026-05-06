-- +goose Up
-- +goose StatementBegin
ALTER TABLE "school"."lesson_level_lock"
RENAME COLUMN "lesson_id" TO "sub_lesson_id";
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "school"."lesson_level_lock"
RENAME COLUMN "sub_lesson_id" TO "lesson_id";
-- +goose StatementEnd
