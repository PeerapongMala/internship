-- +goose Up
-- +goose StatementBegin
alter table grade.evaluation_form_general_evaluation
    drop constraint evaluation_form_general_evaluation_template_general_eval_id_fk;
alter table grade.evaluation_form_general_evaluation
    drop column template_general_evaluation_id;

alter table grade.evaluation_form_general_evaluation
    add template_general_evaluation_id integer
        constraint evaluation_form_general_evaluation_template_general_eval_id_fk
            references grade.template_general_evaluation;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
alter table grade.evaluation_form_general_evaluation
    drop constraint evaluation_form_general_evaluation_template_general_eval_id_fk;
alter table grade.evaluation_form_general_evaluation
    drop column template_general_evaluation_id;

alter table grade.evaluation_form_general_evaluation
    add template_general_evaluation_id integer
        constraint evaluation_form_general_evaluation_template_general_eval_id_fk
            references grade.general_template;
-- +goose StatementEnd
