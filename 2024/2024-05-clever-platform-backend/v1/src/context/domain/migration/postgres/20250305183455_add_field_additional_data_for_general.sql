-- +goose Up
-- +goose StatementBegin
alter table grade.general_template add additional_data jsonb;
alter table grade.template_general_evaluation add additional_data jsonb;
alter table grade.evaluation_form_general_evaluation add additional_data jsonb;

alter table grade.template_subject add hours integer;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
alter table grade.general_template drop column additional_data;
alter table grade.template_general_evaluation drop column additional_data;
alter table grade.evaluation_form_general_evaluation drop column additional_data;

alter table grade.template_subject drop column hours;
-- +goose StatementEnd
