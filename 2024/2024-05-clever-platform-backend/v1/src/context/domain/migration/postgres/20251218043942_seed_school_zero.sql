-- +goose Up
-- +goose StatementBegin
INSERT INTO school.school (
                           id,
                           name,
                           code,
                           address,
                           region,
                           province,
                           district,
                           sub_district,
                           post_code,
                           status,
                           created_at,
                           created_by
)
VALUES (0, 'Nextgen Education', '0', '-', '-', '-', '-', '-', '-', 'enabled', NOW(), '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10')
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM school.school
WHERE id = 0
-- +goose StatementEnd
