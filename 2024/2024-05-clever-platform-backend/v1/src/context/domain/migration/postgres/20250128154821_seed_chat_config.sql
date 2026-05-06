-- +goose Up
-- +goose StatementBegin
INSERT INTO "message"."chat_config" (
    "chat_level",
    "is_enabled"
)
VALUES ('subject', true ),
       ('class', true),
        ('group', true),
        ('private', true);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM "message"."chat_config"
WHERE "chat_level" IN ('subject', 'class', 'group', 'private');
-- +goose StatementEnd
