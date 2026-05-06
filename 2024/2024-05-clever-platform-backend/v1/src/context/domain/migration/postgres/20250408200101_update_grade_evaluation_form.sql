-- +goose Up
-- +goose StatementBegin
alter table grade.evaluation_form_additional_person
    alter column value_id type integer using value_id::integer;
alter table grade.evaluation_form
    add wizard_index integer;

alter table grade.evaluation_form
    alter column academic_year drop not null;
alter table grade.evaluation_form
    alter column year drop not null;
alter table grade.evaluation_form
    alter column school_room drop not null;
alter table grade.evaluation_form
    alter column school_term drop not null;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
alter table grade.evaluation_form_additional_person
    alter column value_id type varchar using value_id::varchar;
alter table grade.evaluation_form
    drop column wizard_index;

alter table grade.evaluation_form
    alter column academic_year set not null;
alter table grade.evaluation_form
    alter column year set not null;
alter table grade.evaluation_form
    alter column school_room set not null;
alter table grade.evaluation_form
    alter column school_term set not null;
-- +goose StatementEnd
