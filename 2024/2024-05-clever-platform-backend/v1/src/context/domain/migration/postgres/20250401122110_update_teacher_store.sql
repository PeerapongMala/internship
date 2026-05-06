-- +goose Up
-- +goose StatementBegin
ALTER TABLE teacher_store.teacher_store
ALTER COLUMN teacher_id TYPE VARCHAR;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE teacher_store.teacher_store
ALTER COLUMN teacher_id TYPE INT;
-- +goose StatementEnd
