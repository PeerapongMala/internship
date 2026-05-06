-- +goose Up
-- +goose StatementBegin
alter table grade.template_indicator add clever_lesson_id integer;
alter table grade.template_indicator add clever_sub_lesson_id integer;

alter table grade.evaluation_form_indicator add clever_lesson_id integer;
alter table grade.evaluation_form_indicator add clever_sub_lesson_id integer;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
alter table grade.template_indicator drop column clever_lesson_id;
alter table grade.template_indicator drop column clever_sub_lesson_id;

alter table grade.evaluation_form_indicator drop column clever_lesson_id;
alter table grade.evaluation_form_indicator drop column clever_sub_lesson_id;
-- +goose StatementEnd
