-- +goose Up
-- +goose StatementBegin
INSERT INTO "platform"."seed_platform" (
    "id",
    "name",
    "owner",
    "remark"
)
VALUES
    (1, 'Clever Platform', 'Pat', 'Pat''s Clever Platform'),
    (2, 'Sci Lab', 'Pat', 'Pat''s Sci lab');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM "platform"."seed_platform" WHERE "id" IN (1, 2);
-- +goose StatementEnd
