-- +goose Up

-- +goose StatementBegin

INSERT INTO "school"."school" (
    "id",
    "name",
    "code",
    "address",
    "region",
    "province",
    "district",
    "sub_district",
    "post_code",
    "status",
    "created_at",
    "created_by"
) VALUES
   ('1', 'โรงเรียนสวนสุนันทา', '1', '123 ถ.สวนสุนันทา', 'ภาคกลาง', 'กรุงเทพมหานคร', 'พระนคร', 'พระนคร', '10200', 'enabled', '2025-01-10 13:00:00', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
-- +goose StatementEnd
-- +goose StatementBegin
INSERT INTO "curriculum_group"."curriculum_group" (
    "id",
    "name",
    "short_name",
    "status",
    "created_at",
    "created_by"
) VALUES
    ('1', 'มหาวิทยาลัยราชภัฎสวนสุนันทา', 'มรภ สวนสุนันทา', 'enabled', '2025-01-10 13:00:00', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
    ('2', 'มหาวิทยาลัยจุฬาลงกรณ์', 'ม จุฬา', 'enabled', '2025-01-10 13:00:00', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
-- +goose StatementEnd

-- +goose StatementBegin
INSERT INTO "curriculum_group"."seed_year" (
    "id",
    "name",
    "short_name",
    "status",
    "created_at",
    "created_by"
) VALUES
    ('1', 'ประถมศึกษาปีที่ 1', 'ป.1', 'enabled', '2025-01-10 13:00:00', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
    ('2', 'ประถมศึกษาปีที่ 2', 'ป.2', 'enabled', '2025-01-10 13:00:00', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
-- +goose StatementEnd
-- +goose StatementBegin
INSERT INTO "curriculum_group"."platform" (
    "id",
    "curriculum_group_id",
    "seed_platform_id",
    "status",
    "created_at",
    "created_by"
) VALUES
    ('1', '1', '1', 'enabled', '2025-01-10 13:00:00', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
    ('2', '1', '2', 'enabled', '2025-01-10 13:00:00', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
-- +goose StatementEnd

-- +goose StatementBegin
INSERT INTO "curriculum_group"."year" (
    "id",
    "curriculum_group_id",
    "platform_id",
    "seed_year_id",
    "status",
    "created_at",
    "created_by"
) VALUES
    ('1', '1', '1', '1', 'enabled', '2025-01-10 13:00:00', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
    ('2', '1', '1', '2', 'enabled', '2025-01-10 13:00:00', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
-- +goose StatementEnd

-- +goose StatementBegin
INSERT INTO "curriculum_group"."subject_group" (
    "id",
    "year_id",
    "seed_subject_group_id",
    "status",
    "created_at",
    "created_by"
) VALUES
    ('1', '1', '1', 'enabled', '2025-01-10 13:00:00', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
    ('2', '2', '2', 'enabled', '2025-01-10 13:00:00', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
-- +goose StatementEnd

-- +goose StatementBegin
INSERT INTO "school_affiliation"."school_affiliation" (
    "id",
    "school_affiliation_group",
    "type",
    "name",
    "short_name",
    "status",
    "created_at",
    "created_by"
) VALUES
    ('1', 'GROUP A', 'รัฐ', 'สังกัด กทม', 'กทม', 'enabled', '2025-01-10 13:00:00', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
    ('2', 'GROUP B', 'รัฐ', 'สังกัด เชียงใหม่', 'ชม', 'enabled', '2025-01-10 13:00:00', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
-- +goose StatementEnd

-- +goose StatementBegin
INSERT INTO "school_affiliation"."contract" (
    "id",
    "school_affiliation_id",
    "seed_platform_id",
    "seed_project_id",
    "name",
    "start_date",
    "end_date",
    "status",
    "wizard_index",
    "created_at",
    "created_by"
) VALUES
    ('1', '1', '1', '1', 'สัญญา กทม', '2025-01-10 13:00:00', '2025-01-10 13:00:00', 'enabled', '1', '2025-01-10 13:00:00', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
    ('2', '1', '1', '1', 'สัญญา ชม', '2025-01-10 13:00:00', '2025-01-10 13:00:00', 'enabled', '1', '2025-01-10 13:00:00', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
-- +goose StatementEnd


-- +goose StatementBegin
INSERT INTO "school_affiliation"."school_affiliation_school" (
    "school_affiliation_id",
    "school_id"
) VALUES
    ('1', '1'),
    ('2', '1');
-- +goose StatementEnd

-- +goose StatementBegin
INSERT INTO "school_affiliation"."contract_school" (
    "contract_id",
    "school_id"
) VALUES
    ('1', '1'),
    ('2', '1');
-- +goose StatementEnd


-- +goose StatementBegin
INSERT INTO "subject"."subject" (
    "id",
    "subject_group_id",
    "name",
    "project",
    "subject_language_type",
    "subject_language",
    "status",
    "created_at",
    "created_by"
) VALUES
    ('1', '1', 'คณิตศาสตร์ 1', '1', '1', 'th', 'enabled', '2025-01-10 13:00:00', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
    ('2', '2', 'อังกฤษ 1', '1', '1', 'th', 'enabled', '2025-01-10 13:00:00', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
-- +goose StatementEnd

-- +goose StatementBegin
INSERT INTO "school"."school_subject" (
   "contract_id", 
   "school_id" ,
   "subject_id",
   "is_enabled"
) VALUES
   ('1','1', '1', 'true'),
   ('2','1', '2', 'true');
-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DELETE FROM "subject"."subject" WHERE "id" IN ('1', '2');
DELETE FROM "school_affiliation"."school_affiliation" WHERE "id" IN ('1', '2');
DELETE FROM "school_affiliation"."contract_school" WHERE "contract_id" IN ('1', '2');
DELETE FROM "school_affiliation"."school_affiliation_school" WHERE "school_affiliation_id" IN ('1', '2');
DELETE FROM "school_affiliation"."contract" WHERE "id" IN ('1', '2');
DELETE FROM "curriculum_group"."subject_group" WHERE "id" IN ('1', '2');
DELETE FROM "curriculum_group"."year" WHERE "id" IN ('1', '2');
DELETE FROM "curriculum_group"."seed_year" WHERE "id" IN ('1', '2');
DELETE FROM "curriculum_group"."curriculum_group" WHERE "id" IN ('1', '2');
-- +goose StatementEnd
