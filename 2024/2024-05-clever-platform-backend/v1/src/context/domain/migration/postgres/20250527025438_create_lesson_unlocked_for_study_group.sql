-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS "school"."lesson_unlocked_for_study_group"
(
    "study_group_id" INT NOT NULL,
    "lesson_id" INT NOT NULL,
    "lock" BOOLEAN NOT NULL,
    PRIMARY KEY ("study_group_id", "lesson_id")
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS "school"."lesson_unlocked_for_study_group";
-- +goose StatementEnd
