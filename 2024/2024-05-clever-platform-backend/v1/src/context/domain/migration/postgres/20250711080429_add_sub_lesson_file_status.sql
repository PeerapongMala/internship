-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS "subject"."sub_lesson_file_status"
(
    "sub_lesson_id" INT,
    "is_updated" BOOLEAN,
    "updated_at" TIMESTAMP,
    "updated_by" CHAR(36),
    PRIMARY KEY (sub_lesson_id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS "subject"."sub_lesson_file_status";
-- +goose StatementEnd
