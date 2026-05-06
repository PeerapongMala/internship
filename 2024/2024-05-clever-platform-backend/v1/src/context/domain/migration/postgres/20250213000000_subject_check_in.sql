-- +goose Up
-- +goose StatementBegin
ALTER TABLE streak_login.subject_checkin ADD miss_login_day varchar NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE streak_login.subject_checkin DROP miss_login_day;
-- +goose StatementEnd
