-- +goose Up
-- +goose StatementBegin
INSERT INTO "user"."user" (
  "id",
  "email",
  "title",
  "first_name",
  "last_name",
  "status",
  "created_at"
)
VALUES
  ('1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', 'admin@admin.com', 'Mr', 'Pat', 'Doe', 'enabled', '2024-10-26T15:06:21Z');

INSERT INTO "user"."user_role" (
  "user_id",
  "role_id"
)
VALUES
  ('1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', 1),
  ('1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', 2),
  ('1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', 3),
  ('1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', 4),
  ('1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', 5);

INSERT INTO "auth"."auth_email_password" (
  "user_id",
  "password_hash"
)
VALUES
  ('1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '$2a$10$wwg4fOjgzpxJXRZYsv7O0u0/EFmv0nbsC.mQwW1siNzmxxPxo4SVy');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM "auth"."auth_email_password" WHERE"user_id" IN ('1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
DELETE FROM "user"."user_role" WHERE "user_id" IN ('1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
DELETE FROM "user"."user" WHERE "id" IN ('1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
-- +goose StatementEnd

