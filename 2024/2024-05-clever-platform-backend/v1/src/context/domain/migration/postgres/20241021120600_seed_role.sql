-- +goose Up
-- +goose StatementBegin
INSERT INTO "user"."role" (
  "id",
  "name"
)
VALUES
  (1, 'admin'),
  (2, 'content_creator'),
  (3, 'game_master'),
  (4, 'observer'),
  (5, 'announcer'),
  (6, 'teacher'),
  (7, 'student'),
  (8, 'parent');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM "user"."role" WHERE "id" IN (1, 2, 3, 4, 5, 6, 7, 8);
-- +goose StatementEnd

