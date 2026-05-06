-- +goose Up
-- +goose StatementBegin
INSERT INTO "auth"."teacher_access" (
  "id",
  "access_name"
)
VALUES
  (1, 'ผู้ดูแลระบบตัดเกรด'),
  (2, 'กรอกคะแนน'),
  (3, 'ตัดเกรด');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM "auth"."teacher_access" WHERE "id" IN (1, 2, 3);
-- +goose StatementEnd
