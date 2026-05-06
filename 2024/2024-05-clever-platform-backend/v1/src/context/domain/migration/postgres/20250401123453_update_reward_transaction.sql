-- +goose Up
-- +goose StatementBegin
ALTER TABLE teacher_item.teacher_reward_transaction
DROP COLUMN subject_teacher_id,
ADD COLUMN subject_id INT,
ADD COLUMN teacher_id VARCHAR;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE teacher_item.teacher_reward_transaction
DROP COLUMN subject_id,
DROP COLUMN teacher_id,
ADD COLUMN subject_teacher_id INT;
-- +goose StatementEnd
