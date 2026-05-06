-- +goose Up
-- +goose StatementBegin
ALTER TABLE "subject"."sub_lesson" ALTER COLUMN "indicator_id" DROP NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "subject"."sub_lesson" ALTER COLUMN "indicator_id" SET NOT NULL;
-- +goose StatementEnd
