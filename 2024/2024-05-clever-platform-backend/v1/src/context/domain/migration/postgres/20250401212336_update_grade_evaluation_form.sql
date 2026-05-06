-- +goose Up
-- +goose StatementBegin
ALTER TABLE grade.evaluation_form
    ADD is_archived BOOLEAN DEFAULT FALSE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE grade.evaluation_form
DROP COLUMN is_archived;
-- +goose StatementEnd
