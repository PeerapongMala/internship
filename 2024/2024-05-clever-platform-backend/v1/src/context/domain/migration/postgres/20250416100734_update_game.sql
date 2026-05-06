-- +goose Up
-- +goose StatementBegin
ALTER TABLE "game"."avatar" ADD CONSTRAINT "uq_game_avatar_model_id" UNIQUE ("model_id");
ALTER TABLE "game"."pet" ADD CONSTRAINT "uq_game_pet_model_id" UNIQUE ("model_id");
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "game"."avatar" DROP CONSTRAINT "uq_game_avatar_model_id";
ALTER TABLE "game"."pet" DROP CONSTRAINT "uq_game_pet_model_id";
-- +goose StatementEnd
