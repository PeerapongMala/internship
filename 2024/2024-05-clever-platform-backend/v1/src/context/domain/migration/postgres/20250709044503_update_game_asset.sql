-- +goose Up
-- +goose StatementBegin
ALTER TABLE "game"."game_asset" ADD COLUMN "version" VARCHAR;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "game"."game_asset" DROP COLUMN "version";
-- +goose StatementEnd
