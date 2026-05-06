BEGIN
TRANSACTION;

INSERT
INTO curriculum_group.curriculum_group
("name",
 short_name,
 status,
 created_at,
 created_by)
VALUES ('มหาวิทยาลัยราชภัฎสวนสุนันทา',
        'มรภ. สวนสุนันทา',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT
INTO curriculum_group.seed_year
(name,
 short_name,
 status,
 created_at,
 created_by)
VALUES ('ประถมศึกษาปีที่ 1',
        'ป.1',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       ('ประถมศึกษาปีที่ 2',
        'ป.2',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       ('ประถมศึกษาปีที่ 3',
        'ป.3',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       ('ประถมศึกษาปีที่ 4',
        'ป.4',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       ('ประถมศึกษาปีที่ 5',
        'ป.5',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       ('ประถมศึกษาปีที่ 6',
        'ป.6',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT
INTO curriculum_group.platform
(curriculum_group_id,
 seed_platform_id,
 status,
 created_at,
 created_by)
VALUES (1,
        1,
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT
INTO curriculum_group."year"
(platform_id,
 curriculum_group_id,
 created_at,
 created_by,
 status,
 seed_year_id)
VALUES (1,
        1,
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10',
        'enabled',
        4);

INSERT
INTO curriculum_group.subject_group
(year_id,
 status,
 created_at,
 created_by,
 seed_subject_group_id)
VALUES (1,
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10',
        2);

INSERT
INTO subject.subject
(subject_group_id,
 "name",
 project,
 subject_language_type,
 subject_language,
 status,
 created_at,
 created_by)
VALUES (1,
        'ภาษาอังกฤษ',
        'Clever Platform',
        'custom',
        'en',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

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
    )
INSERT
INTO item.badge (item_id,
                 template_path,
                 badge_description)
SELECT inserted_item.id,
       '/path/to/badge-template',
       'นักเรียนเรียนรู้เร็ว'
FROM inserted_item;

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
    NULL, NULL, 'badge', 'item badge 2', 'item badge 2 description', 'https://w7.pngwing.com/pngs/15/560/png-transparent-verified-badge-symbol-computer-icons-twitter-discord-flat-icon-blue-text-logo-thumbnail.png', 'enabled', '2024-12-16T06:50:07.699Z', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2024-12-16T06:50:07.699Z', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'
    )
    RETURNING id
    )
INSERT
INTO item.badge (item_id,
                 template_path,
                 badge_description)
SELECT inserted_item.id,
       '/path/to/badge-template2',
       'นักเรียนเรียนรู้ช้า'
FROM inserted_item;

INSERT
INTO subject.lesson
(subject_id,
 "index",
 "name",
 font_name,
 font_size,
 background_image_path,
 status,
 created_at,
 created_by,
 wizard_index)
VALUES (1,
        1,
        'Lesson 1',
        'Noto Sans Thai',
        'Size S - 14 pt',
        'image path',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10',
        5);

INSERT
INTO subject.subject_translation
(subject_id,
 "language")
VALUES (1,
        'th'),
       (1,
        'zh');

INSERT
INTO subject.tag_group
(subject_id,
 "name",
 "index")
VALUES (1,
        'กลุ่ม tag ที่ 1',
        1),
       (1,
        'กลุ่ม tag ที่ 2',
        2),
       (1,
        'กลุ่ม tag ที่ 3',
        3);

INSERT
INTO subject.tag
(tag_group_id,
 "name",
 status,
 created_at,
 created_by)
VALUES (1,
        'หัวข้อ 1 กลุ่ม tag ที่ 1',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        'หัวข้อ 2 กลุ่ม tag ที่ 1',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (2,
        'หัวข้อ 1 กลุ่ม tag ที่ 2',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (2,
        'หัวข้อ 2 กลุ่ม tag ที่ 2',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (3,
        'หัวข้อ 1 กลุ่ม tag ที่ 3',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (3,
        'หัวข้อ 2 กลุ่ม tag ที่ 3',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT
INTO curriculum_group.learning_area
(curriculum_group_id,
 year_id,
 "name",
 status,
 created_at,
 created_by)
VALUES (1,
        1,
        'คณิตศาสตร์',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT
INTO curriculum_group."content"
(learning_area_id,
 "name",
 status,
 created_at,
 created_by)
VALUES (1,
        'จำนวนและพีชคณิต',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT
INTO curriculum_group.criteria
(content_id,
 "name",
 short_name,
 status,
 created_at,
 created_by)
VALUES (1,
        'เข้าใจความหลากหลายของการแสดงจำนวน',
        '1.2',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT
INTO curriculum_group.learning_content
(criteria_id,
 "name",
 status,
 created_at,
 created_by)
VALUES (1,
        'จำนวนนับที่มากกว่า 100,000',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT
INTO curriculum_group."indicator"
(learning_content_id,
 "name",
 short_name,
 transcript_name,
 status,
 created_at,
 created_by)
VALUES (1,
        'อ่านและเขียนตัวเลข',
        'p.4/4',
        'ป4/1.1/1/1',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT
INTO curriculum_group.sub_criteria
(curriculum_group_id,
 "name",
 "index")
VALUES (1,
        'CEFR',
        1),
       (1,
        'มาตรฐานย่อย 2',
        2),
       (1,
        'มาตรฐานย่อย 3',
        3);

INSERT
INTO curriculum_group.sub_criteria_topic
(indicator_id,
 "name",
 short_name,
 status,
 created_at,
 created_by,
 year_id,
 sub_criteria_id)
VALUES (1,
        'เข้าใจความหลากหลายชของการแสดงจำนวน',
        'cando 1',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10',
        1,
        1);

INSERT
INTO curriculum_group.sub_criteria_topic
(indicator_id,
 "name",
 short_name,
 status,
 created_at,
 created_by,
 year_id,
 sub_criteria_id)
VALUES (1,
        'เข้าใจความหลากหลายชของการแสดงตัวเลข',
        'cando 2',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10',
        1,
        1);

INSERT
INTO curriculum_group.sub_criteria_topic
(indicator_id,
 "name",
 short_name,
 status,
 created_at,
 created_by,
 year_id,
 sub_criteria_id)
VALUES (1,
        'เข้าใจความหลากหลายชของการแสดงโจทย์',
        'cando 3',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10',
        1,
        1);

INSERT
INTO curriculum_group.sub_criteria_topic
(indicator_id,
 "name",
 short_name,
 status,
 created_at,
 created_by,
 year_id,
 sub_criteria_id)
VALUES (1,
        'เข้าใจความหลากหลายชของการแสดงโจทย์',
        'cando 4',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10',
        1,
        1);

INSERT
INTO curriculum_group.sub_criteria_topic
(indicator_id,
 "name",
 short_name,
 status,
 created_at,
 created_by,
 year_id,
 sub_criteria_id)
VALUES (1,
        'เข้าใจความหลากหลายชของการแสดงโจทย์',
        'cando 5',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10',
        1,
        1);

INSERT
INTO curriculum_group.sub_criteria_topic
(indicator_id,
 "name",
 short_name,
 status,
 created_at,
 created_by,
 year_id,
 sub_criteria_id)
VALUES (1,
        'ชื่อหัวข้อมาตรฐานย่อย WHAT-1',
        'WHAT-1',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10',
        1,
        2);

INSERT
INTO curriculum_group.sub_criteria_topic
(indicator_id,
 "name",
 short_name,
 status,
 created_at,
 created_by,
 year_id,
 sub_criteria_id)
VALUES (1,
        'ชื่อหัวข้อมาตรฐานย่อย WHAT-2',
        'WHAT-2',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10',
        1,
        2);

INSERT
INTO curriculum_group.sub_criteria_topic
(indicator_id,
 "name",
 short_name,
 status,
 created_at,
 created_by,
 year_id,
 sub_criteria_id)
VALUES (1,
        'ชื่อหัวข้อมาตรฐานย่อย WHAT-3',
        'WHAT-3',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10',
        1,
        2);

INSERT
INTO curriculum_group.sub_criteria_topic
(indicator_id,
 "name",
 short_name,
 status,
 created_at,
 created_by,
 year_id,
 sub_criteria_id)
VALUES (1,
        'ชื่อหัวข้อมาตรฐานย่อย WHERE-1',
        'WHERE-1',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10',
        1,
        3);

INSERT
INTO curriculum_group.sub_criteria_topic
(indicator_id,
 "name",
 short_name,
 status,
 created_at,
 created_by,
 year_id,
 sub_criteria_id)
VALUES (1,
        'ชื่อหัวข้อมาตรฐานย่อย WHERE-2',
        'WHERE-2',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10',
        1,
        3);

INSERT
INTO curriculum_group.sub_criteria_topic
(indicator_id,
 "name",
 short_name,
 status,
 created_at,
 created_by,
 year_id,
 sub_criteria_id)
VALUES (1,
        'ชื่อหัวข้อมาตรฐานย่อย WHERE-3',
        'WHERE-3',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10',
        1,
        3);

INSERT
INTO curriculum_group.saved_text
(curriculum_group_id,
 group_id,
 "language",
 "text",
 "text_to_ai",
 status,
 created_at,
 created_by)
VALUES (1,
        'e0c8e0a9-9d57-44cf-99a8-fe415d27da69',
        'th',
        'description th',
        'description th',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        'e0c8e0a9-9d57-44cf-99a8-fe415d27da69',
        'en',
        'description en',
        'description en',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        'e0c8e0a9-9d57-44cf-99a8-fe415d27da69',
        'zh',
        'description zh',
        'description zh',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '4dac6191-0082-45b7-9240-2f5601284c44',
        'th',
        'choice 1 th',
        'choice 1 th',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '4dac6191-0082-45b7-9240-2f5601284c44',
        'en',
        'choice 1 en',
        'choice 1 en',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '4dac6191-0082-45b7-9240-2f5601284c44',
        'zh',
        'choice 1 zh',
        'choice 1 zh',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '2a8113c0-1c51-4f8c-9c46-56e951220a53',
        'th',
        'choice 2 th',
        'choice 2 th',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '2a8113c0-1c51-4f8c-9c46-56e951220a53',
        'en',
        'choice 2 en',
        'choice 2 en',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '2a8113c0-1c51-4f8c-9c46-56e951220a53',
        'zh',
        'choice 2 zh',
        'choice 2 zh',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        'c1564b2d-9b35-47be-8675-e4b8bae76d2a',
        'th',
        'choice 3 th',
        'choice 3 th',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        'c1564b2d-9b35-47be-8675-e4b8bae76d2a',
        'en',
        'choice 3 en',
        'choice 3 en',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        'c1564b2d-9b35-47be-8675-e4b8bae76d2a',
        'zh',
        'choice 3 zh',
        'choice 3 zh',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '6aeaaea7-2271-4b0d-ad4e-952de7be8693',
        'th',
        'group 1 th',
        'group 1 th',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '6aeaaea7-2271-4b0d-ad4e-952de7be8693',
        'en',
        'group 1 en',
        'group 1 en',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '6aeaaea7-2271-4b0d-ad4e-952de7be8693',
        'zh',
        'group 1 zh',
        'group 1 zh',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '08ef729b-7c7c-4d8b-82cf-9565c68571f9',
        'th',
        'group 2 th',
        'group 2 th',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '08ef729b-7c7c-4d8b-82cf-9565c68571f9',
        'en',
        'group 2 en',
        'group 2 en',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '08ef729b-7c7c-4d8b-82cf-9565c68571f9',
        'zh',
        'group 2 zh',
        'group 2 zh',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        'c77cd302-a81c-41a7-926d-3dbcff629bb4',
        'th',
        'group 3 th',
        'group 3 th',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        'c77cd302-a81c-41a7-926d-3dbcff629bb4',
        'en',
        'group 3 en',
        'group 3 en',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        'c77cd302-a81c-41a7-926d-3dbcff629bb4',
        'zh',
        'group 3 zh',
        'group 3 zh',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '61563e9e-5385-48d8-981b-a47dd415f9cc',
        'th',
        'correct text th',
        'correct text th',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '61563e9e-5385-48d8-981b-a47dd415f9cc',
        'en',
        'correct text en',
        'correct text en',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '61563e9e-5385-48d8-981b-a47dd415f9cc',
        'zh',
        'correct text zh',
        'correct text zh',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '7bb93f80-18e6-4660-9126-ac7ebf4eb593',
        'th',
        'wrong text th',
        'wrong text th',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '7bb93f80-18e6-4660-9126-ac7ebf4eb593',
        'en',
        'wrong text en',
        'wrong text en',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '7bb93f80-18e6-4660-9126-ac7ebf4eb593',
        'zh',
        'wrong text zh',
        'wrong text zh',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '9288a132-4ca3-49a8-a94f-7a906a9726b1',
        'th',
        'command text th',
        'command text th',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '9288a132-4ca3-49a8-a94f-7a906a9726b1',
        'en',
        'command text en',
        'command text en',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        '9288a132-4ca3-49a8-a94f-7a906a9726b1',
        'zh',
        'command text zh',
        'command text zh',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        'd91b496a-516f-4923-9c59-345a4738829c',
        'th',
        'hint text th',
        'hint text th',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        'd91b496a-516f-4923-9c59-345a4738829c',
        'en',
        'hint text en',
        'hint text en',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (1,
        'd91b496a-516f-4923-9c59-345a4738829c',
        'zh',
        'hint text zh',
        'hint text zh',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT
INTO subject.sub_lesson
(lesson_id,
 indicator_id,
 "name",
 status,
 created_at,
 created_by,
 "index")
VALUES (1,
        1,
        'Sub-lesson 1',
        'draft',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10',
        1);

COMMIT;
