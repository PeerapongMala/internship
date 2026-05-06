-- +goose Up
-- +goose StatementBegin
create table grade.document_template
(
    id               varchar   not null
        constraint document_template_pk
            primary key,
    logo_image       varchar,
    background_image varchar,
    colour_setting   text,
    "created_at"     timestamp NOT NULL,
    "created_by"     char(36)  NOT NULL,
    "updated_at"     timestamp,
    "updated_by"     char(36)
);


-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
drop table grade.document_template;
-- +goose StatementEnd
