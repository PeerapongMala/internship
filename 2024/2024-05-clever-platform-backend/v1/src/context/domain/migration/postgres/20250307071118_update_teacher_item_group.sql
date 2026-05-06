-- +goose Up
-- +goose StatementBegin
ALTER TABLE teacher_item.teacher_item_group
ADD CONSTRAINT subject_teacher_uq UNIQUE (subject_id, teacher_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE teacher_item.teacher_item_group
DROP CONSTRAINT IF EXISTS subject_teacher_uq;
-- +goose StatementEnd
