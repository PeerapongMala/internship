-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS "school"."seed_academic_year" (
    "academic_year" INT PRIMARY KEY
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS "school"."seed_academic_year";
-- +goose StatementEnd
