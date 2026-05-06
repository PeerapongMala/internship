-- +goose Up
-- +goose StatementBegin
ALTER TABLE "grade"."evaluation_form_additional_person" ADD CONSTRAINT "uq_form_id_value_type_value_id_user_type_user_id" UNIQUE ("form_id", "value_type", "value_id", "user_type", "user_id");
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "grade"."evaluation_form_additional_person" DROP CONSTRAINT "uq_form_id_value_type_value_id_user_type_user_id";
-- +goose StatementEnd
