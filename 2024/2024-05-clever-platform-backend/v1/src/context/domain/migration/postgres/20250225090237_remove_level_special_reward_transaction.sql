-- +goose Up
-- +goose StatementBegin
DROP TABLE IF EXISTS level.level_special_reward_transaction;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS level.level_special_reward_transaction (
    level_special_reward_id INT       NOT NULL,
    student_id              CHAR(36)  NOT NULL,
    received_at             TIMESTAMP NOT NULL,
    PRIMARY KEY (level_special_reward_id, student_id),
    CONSTRAINT fk_level_special_reward FOREIGN KEY (level_special_reward_id) REFERENCES level.level_special_reward (id),
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES "user".student (user_id)
);
-- +goose StatementEnd
