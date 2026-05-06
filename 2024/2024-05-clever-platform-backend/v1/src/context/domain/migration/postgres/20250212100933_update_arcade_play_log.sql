-- +goose Up
-- +goose StatementBegin
ALTER TABLE "arcade"."arcade_play_log" ADD COLUMN "wave" INT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "arcade"."arcade_play_log" DROP "wave";
-- +goose StatementEnd
