-- +goose Up
-- +goose StatementBegin
ALTER TABLE "subject"."subject" ADD CONSTRAINT "uq_subject_group_id_name" UNIQUE ("subject_group_id", "name");
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "subject"."subject" DROP CONSTRAINT "uq_subject_group_id_name";
-- +goose StatementEnd
