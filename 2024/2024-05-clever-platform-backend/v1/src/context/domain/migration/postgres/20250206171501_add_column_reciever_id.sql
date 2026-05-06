-- +goose Up
-- +goose StatementBegin
ALTER TABLE "message"."messages" 
ADD COLUMN "receiver_id" CHAR(36);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "message"."messages" 
DROP COLUMN "receiver_id";
-- +goose StatementEnd
