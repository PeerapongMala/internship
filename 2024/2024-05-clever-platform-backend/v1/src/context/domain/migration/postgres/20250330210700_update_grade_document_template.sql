-- +goose Up
-- +goose StatementBegin
alter table grade.document_template
    add school_id integer
        constraint document_template_school_id_fk
            references school.school;

alter table grade.document_template
    drop constraint document_template_pk;

create unique index document_template_school_id_id_uindex
    on grade.document_template (school_id, id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
drop index if exists grade.document_template_school_id_id_uindex;

alter table grade.document_template
    add constraint document_template_pk primary key (id);

alter table grade.document_template
    drop constraint if exists document_template_school_id_fk;

alter table grade.document_template
    drop column if exists school_id;
-- +goose StatementEnd