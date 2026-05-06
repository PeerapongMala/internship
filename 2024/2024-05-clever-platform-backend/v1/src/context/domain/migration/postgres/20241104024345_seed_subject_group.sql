-- +goose Up
-- +goose StatementBegin
INSERT INTO "curriculum_group"."seed_subject_group" (
    "id",
    "name"
)
VALUES
    (1, 'คณิตศาสตร์'),
    (2, 'ภาษาอังกฤษ'),
    (3, 'กลุ่มวิชาที่ 3'),
    (4, 'กลุ่มวิชาที่ 4');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM "curriculum_group"."subject_group"
WHERE "id" IN (1, 2, 3, 4);
-- +goose StatementEnd
