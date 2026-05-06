-- +goose Up
-- +goose StatementBegin
ALTER TABLE question.student_group_answer
DROP CONSTRAINT IF EXISTS student_group_answer_question_group_choice_id_fkey;

ALTER TABLE question.student_group_answer
DROP CONSTRAINT IF EXISTS student_group_answer_question_group_group_id_fkey;

ALTER TABLE question.student_input_answer
DROP CONSTRAINT IF EXISTS student_input_answer_question_input_answer_id_fkey;

ALTER TABLE question.student_multiple_choice_answer
DROP CONSTRAINT IF EXISTS student_multiple_choice_answe_question_multiple_choice_ima_fkey;

ALTER TABLE question.student_multiple_choice_answer
DROP CONSTRAINT IF EXISTS student_multiple_choice_answe_question_multiple_choice_tex_fkey;

ALTER TABLE question.student_placeholder_answer
DROP CONSTRAINT IF EXISTS student_placeholder_answer_question_placeholder_answer_id_fkey;

ALTER TABLE question.student_placeholder_answer
DROP CONSTRAINT IF EXISTS student_placeholder_answer_question_placeholder_text_choic_fkey;

ALTER TABLE question.student_sort_answer
DROP CONSTRAINT IF EXISTS student_sort_answer_question_sort_text_choice_id_fkey;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd
