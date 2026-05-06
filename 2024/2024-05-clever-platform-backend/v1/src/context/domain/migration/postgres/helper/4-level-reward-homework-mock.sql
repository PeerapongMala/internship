BEGIN
TRANSACTION;

WITH inserted_item AS (
INSERT
INTO item.item (teacher_item_group_id,
                template_item_id,
                "type",
                "name",
                description,
                image_url,
                status,
                created_at,
                created_by,
                updated_at,
                updated_by,
                admin_login_as)
VALUES (
    NULL, NULL, 'badge', 'item badge 1', 'item badge 1 description', 'https://e7.pngegg.com/pngimages/626/893/png-clipart-blue-and-white-check-logo-facebook-social-media-verified-badge-logo-vanity-url-blue-checkmark-blue-angle-thumbnail.png', 'enabled', '2024-12-16T06:50:07.699Z', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2024-12-16T06:50:07.699Z', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'
    )
    RETURNING id
    ), inserted_badge AS (
INSERT
INTO item.badge (item_id,
                 template_path,
                 badge_description)
SELECT
    inserted_item.id, '/path/to/badge-template', 'นักเรียนเรียนรู้เร็ว'
FROM
    inserted_item
    RETURNING item_id
    )
INSERT
INTO "level"."level_special_reward" (level_id,
                                     item_id,
                                     amount)
SELECT 1,
       inserted_badge.item_id,
       2
FROM inserted_badge;

INSERT
INTO "level".level_reward
(seed_subject_group_id,
 level_type,
 star_required,
 gold_coin,
 arcade_coin)
VALUES (1,
        'test',
        1,
        100,
        20),
       (2,
        'test',
        1,
        150,
        30);

WITH inserted_study_group AS (
INSERT
INTO
    "class".study_group (subject_id,
                         class_id,
                         "name",
                         status,
                         created_at,
                         created_by)
VALUES (
    1, 1, 'Clever Group', 'enabled', '2024-12-16T06:50:07.699Z', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'
    )
    RETURNING id
    )
INSERT
INTO
    "class"."study_group_student" (study_group_id,
                                   student_id)
SELECT inserted_study_group.id,
       'cd1592be-7302-4805-a172-86956b0bf2a1'
FROM inserted_study_group;


WITH inserted_homework_template AS (
INSERT
INTO "homework".homework_template (subject_id,
                                   year_id,
                                   lesson_id,
                                   teacher_id,
                                   status,
                                   created_at,
                                   created_by)
VALUES (
    1, 1, 1, '00f1b13e-0e62-45d2-9718-099cd545b3ac', 'enabled', '2024-12-16T06:50:07.699Z', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'
    )
    RETURNING id
    ), inserted_homework AS (
INSERT
INTO "homework"."homework" ("name",
                            subject_id,
                            year_id,
                            homework_template_id,
                            started_at,
                            due_at,
                            closed_at,
                            status,
                            created_at,
                            created_by)
SELECT
    'การบ้าน 1', 1, 1, inserted_homework_template.id, '2024-12-16T06:50:07.699Z', '2024-12-16T06:50:07.699Z', '2024-12-16T06:50:07.699Z', 'enabled', '2024-12-16T06:50:07.699Z', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'
FROM inserted_homework_template
    RETURNING id
    ), inserted_homework_template_level AS (
INSERT
INTO "homework"."homework_template_level" (homework_template_id,
                                           level_id)
SELECT
    inserted_homework_template.id, 1
FROM inserted_homework_template
    )
INSERT
INTO "homework"."homework_assigned_to_class" (class_id,
                                              homework_id)
SELECT 1,
       inserted_homework.id
FROM inserted_homework;

COMMIT;