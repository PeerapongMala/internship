-- +goose Up
-- +goose StatementBegin
alter table grade.evaluation_data_entry
    add start_edit_at timestamp default now();

alter table grade.evaluation_data_entry
    add end_edit_at timestamp default now();

alter table grade.evaluation_sheet
    add current_data_entry_id integer
        constraint evaluation_sheet_evaluation_data_entry_id_fk
            references grade.evaluation_data_entry;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
alter table grade.evaluation_data_entry drop column start_edit_at;
alter table grade.evaluation_data_entry drop column end_edit_at;
alter table grade.evaluation_sheet drop column current_data_entry_id;
-- +goose StatementEnd
