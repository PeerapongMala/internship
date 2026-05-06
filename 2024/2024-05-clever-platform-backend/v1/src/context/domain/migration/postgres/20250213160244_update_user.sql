-- +goose Up
-- +goose StatementBegin
UPDATE "user"."user" SET "email" = 'user' || floor(random() * 10000000)::TEXT || '@email.com' WHERE "email" IS NULL;
ALTER TABLE "user"."user" ALTER COLUMN "email" SET NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "user"."user" ALTER COLUMN "email" DROP NOT NULL;
-- +goose StatementEnd
