-- +goose Up
-- +goose StatementBegin
ALTER TABLE item.badge ADD CONSTRAINT badge_pkey PRIMARY KEY (item_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE item.badge DROP CONSTRAINT badge_pkey;
-- +goose StatementEnd
