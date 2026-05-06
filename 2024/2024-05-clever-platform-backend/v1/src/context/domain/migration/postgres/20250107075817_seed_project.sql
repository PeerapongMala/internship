-- +goose Up
-- +goose StatementBegin
INSERT INTO "platform"."seed_project" (
    "id",
    "seed_platform_id",
    "name",
    "owner",
    "remark"
)
VALUES
    (1, 1,'Clever Platform 0', 'Pat', 'Pat''s Clever Platform Project 0');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM "platform"."seed_project" WHERE "id" IN (1);
-- +goose StatementEnd
