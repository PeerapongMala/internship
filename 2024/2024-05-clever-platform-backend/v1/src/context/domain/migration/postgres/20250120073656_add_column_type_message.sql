-- +goose Up
-- +goose StatementBegin
ALTER TABLE "message"."messages" 
ADD COLUMN "room_type" VARCHAR(20) NOT NULL DEFAULT 'default_value';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "message"."messages" 
DROP COLUMN "room_type";
-- +goose StatementEnd
