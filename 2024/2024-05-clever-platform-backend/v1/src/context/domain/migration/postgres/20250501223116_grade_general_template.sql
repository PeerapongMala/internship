-- +goose Up
-- +goose StatementBegin
alter table grade.template_general_evaluation
    add general_template_id integer
        constraint template_general_evaluation_general_template_id_fk
            references grade.general_template;

alter table grade.evaluation_form_general_evaluation
    add template_general_evaluation_id integer
        constraint evaluation_form_general_evaluation_template_general_eval_id_fk
            references grade.general_template;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
alter table grade.template_general_evaluation
    drop constraint template_general_evaluation_general_template_id_fk;
alter table grade.template_general_evaluation
    drop column general_template_id;

alter table grade.evaluation_form_general_evaluation
    drop constraint evaluation_form_general_evaluation_template_general_eval_id_fk;
alter table grade.evaluation_form_general_evaluation
    drop column template_general_evaluation_id;
-- +goose StatementEnd
