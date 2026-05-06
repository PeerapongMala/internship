-- +goose Up
-- +goose StatementBegin
alter table grade.template_indicator rename column weight to max_value;
alter table grade.template_indicator alter column max_value type numeric(10, 2) using max_value::numeric(10, 2);

alter table grade.template_assessment_setting alter column weight type numeric(10, 2) using weight::numeric(10, 2);

alter table grade.evaluation_form_indicator rename column weight to max_value;
alter table grade.evaluation_form_indicator alter column max_value type numeric(10, 2) using max_value::numeric(10, 2);

alter table grade.evaluation_form_setting alter column weight type numeric(10, 2) using weight::numeric(10, 2);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

alter table grade.template_indicator rename column max_value to weight;
alter table grade.template_indicator alter column weight type varchar using weight::varchar;

alter table grade.template_assessment_setting alter column weight type varchar using weight::varchar;

alter table grade.evaluation_form_indicator rename column max_value to weight;
alter table grade.evaluation_form_indicator alter column weight type varchar using weight::varchar;

alter table grade.evaluation_form_setting alter column weight type varchar using weight::varchar;
-- +goose StatementEnd
