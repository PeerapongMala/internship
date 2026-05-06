-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS "school"."lesson_unlocked_for_student"
(
    "class_id" INT NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "lesson_id" INT NOT NULL,
    "lock" BOOLEAN NOT NULL,
    PRIMARY KEY ("class_id", "user_id", "lesson_id")
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS "school"."lesson_unlocked_for_student";
-- +goose StatementEnd