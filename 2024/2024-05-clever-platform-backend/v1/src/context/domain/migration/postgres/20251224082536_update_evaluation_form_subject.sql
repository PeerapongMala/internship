-- +goose Up
-- +goose StatementBegin
ALTER TABLE grade.evaluation_form_subject ALTER COLUMN template_subject_id DROP NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE grade.evaluation_form_subject ALTER COLUMN template_subject_id SET NOT NULL;
-- +goose StatementEnd
