-- +goose Up
-- +goose StatementBegin
ALTER TABLE "message"."messages" 
ADD COLUMN "school_id" INT NOT NULL DEFAULT 0;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "message"."messages" 
DROP COLUMN "school_id";
-- +goose StatementEnd
