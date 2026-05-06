INSERT INTO "user"."user" (id, email, title, first_name, last_name, id_number, image_url, status, created_at, created_by, updated_at, updated_by, last_login)
VALUES
    ('cd1592be-7302-4805-a172-86956b0bf2a2', 'student2@student.com', 'เด็กชาย', 'อภิชาติ2', 'เชื้อ2', '110234993242', 'https://example.com/dummy.png', 'enabled', '2024-11-18 17:25:19.821', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', NULL, NULL, '2025-02-07 12:56:23.110'),
    ('cd1592be-7302-4805-a172-86956b0bf2a3', 'student3@student.com', 'เด็กชาย', 'อภิชาติ3', 'เชื้อ3', '110234993244', 'https://example.com/dummy.png', 'enabled', '2024-11-18 17:25:19.821', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', NULL, NULL, '2025-02-07 12:56:23.110'),
    ('cd1592be-7302-4805-a172-86956b0bf2a4', 'student4@student.com', 'เด็กชาย', 'อภิชาติ4', 'เชื้อ4', '110234993245', 'https://example.com/dummy.png', 'enabled', '2024-11-18 17:25:19.821', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', NULL, NULL, '2025-02-07 12:56:23.110');

INSERT INTO "user".student (user_id, school_id, student_id, "year", birth_date, nationality, ethnicity, religion, father_title, father_first_name, father_last_name, mother_title, mother_first_name, mother_last_name, parent_relationship, parent_title, parent_first_name, parent_last_name, house_number, moo, district, sub_district, province, post_code, parent_marital_status)
VALUES
    ('cd1592be-7302-4805-a172-86956b0bf2a2', 1, '17341', 'ป.4', '2024-11-18', 'ไทย', 'ไทย', 'พุทธ', 'นาย', 'ธนา', 'พัฒนกุล', 'นาง', 'นิตยา', 'อภิชาติเชื้อ', NULL, NULL, NULL, NULL, '123/132', '1', 'บางแค', 'บางมด', 'กรุงเทพมหานคร', '10150', 'อย่าร้าง'),
    ('cd1592be-7302-4805-a172-86956b0bf2a3', 1, '17342', 'ป.4', '2024-11-18', 'ไทย', 'ไทย', 'พุทธ', 'นาย', 'ธนา', 'พัฒนกุล', 'นาง', 'นิตยา', 'อภิชาติเชื้อ', NULL, NULL, NULL, NULL, '123/132', '1', 'บางแค', 'บางมด', 'กรุงเทพมหานคร', '10150', 'อย่าร้าง'),
    ('cd1592be-7302-4805-a172-86956b0bf2a4', 1, '17343', 'ป.4', '2024-11-18', 'ไทย', 'ไทย', 'พุทธ', 'นาย', 'ธนา', 'พัฒนกุล', 'นาง', 'นิตยา', 'อภิชาติเชื้อ', NULL, NULL, NULL, NULL, '123/132', '1', 'บางแค', 'บางมด', 'กรุงเทพมหานคร', '10150', 'อย่าร้าง');


INSERT INTO school.class_student (class_id, student_id)
VALUES
    (1, 'cd1592be-7302-4805-a172-86956b0bf2a2'),
    (1, 'cd1592be-7302-4805-a172-86956b0bf2a3'),
    (1, 'cd1592be-7302-4805-a172-86956b0bf2a4');

INSERT INTO class.study_group_student (study_group_id, student_id)
SELECT id, student_id
FROM class.study_group
         CROSS JOIN (VALUES
                         ('cd1592be-7302-4805-a172-86956b0bf2a2'),
                         ('cd1592be-7302-4805-a172-86956b0bf2a3'),
                         ('cd1592be-7302-4805-a172-86956b0bf2a4')
) AS students(student_id)
WHERE name = 'Clever Group';

WITH inserted_play_logs AS (
    INSERT INTO "level".level_play_log
        (class_id, student_id, level_id, homework_id, played_at, star, time_used, admin_login_as)
        VALUES
            (1, 'cd1592be-7302-4805-a172-86956b0bf2a1', 2, NULL, '2025-02-07 20:02:37.987', 0, 0, NULL),
            (1, 'cd1592be-7302-4805-a172-86956b0bf2a2', 2, NULL, '2025-02-07 20:02:37.987', 0, 0, NULL),
            (1, 'cd1592be-7302-4805-a172-86956b0bf2a3', 2, NULL, '2025-02-07 20:02:37.987', 0, 0, NULL),
            (1, 'cd1592be-7302-4805-a172-86956b0bf2a4', 2, NULL, '2025-02-07 20:02:37.987', 0, 0, NULL)
        RETURNING id, student_id
)

INSERT INTO question.question_play_log (level_play_log_id, question_id, is_correct, time_used)
SELECT inserted_play_logs.id, qp.question_id, qp.is_correct, qp.time_used
FROM inserted_play_logs
LEFT JOIN (
    VALUES
        ('cd1592be-7302-4805-a172-86956b0bf2a1', 1, true, 20),
        ('cd1592be-7302-4805-a172-86956b0bf2a1', 2, false, 30),
        ('cd1592be-7302-4805-a172-86956b0bf2a1', 3, false, 32),
        ('cd1592be-7302-4805-a172-86956b0bf2a1', 4, false, 34),
        ('cd1592be-7302-4805-a172-86956b0bf2a1', 5, false, 10),
        ('cd1592be-7302-4805-a172-86956b0bf2a1', 6, true, 10),

        ('cd1592be-7302-4805-a172-86956b0bf2a2', 1, true, 20),
        ('cd1592be-7302-4805-a172-86956b0bf2a2', 2, true, 30),
        ('cd1592be-7302-4805-a172-86956b0bf2a2', 3, true, 32),
        ('cd1592be-7302-4805-a172-86956b0bf2a2', 4, true, 70),
        ('cd1592be-7302-4805-a172-86956b0bf2a2', 5, true, 20),
        ('cd1592be-7302-4805-a172-86956b0bf2a2', 6, true, 30),

        ('cd1592be-7302-4805-a172-86956b0bf2a3', 1, true, 20),
        ('cd1592be-7302-4805-a172-86956b0bf2a3', 2, true, 30),
        ('cd1592be-7302-4805-a172-86956b0bf2a3', 3, false, 90),
        ('cd1592be-7302-4805-a172-86956b0bf2a3', 4, true, 3),
        ('cd1592be-7302-4805-a172-86956b0bf2a3', 5, false, 100),
        ('cd1592be-7302-4805-a172-86956b0bf2a3', 6, true, 10),

        ('cd1592be-7302-4805-a172-86956b0bf2a4', 1, true, 100),
        ('cd1592be-7302-4805-a172-86956b0bf2a4', 2, true, 30),
        ('cd1592be-7302-4805-a172-86956b0bf2a4', 3, true, 60),
        ('cd1592be-7302-4805-a172-86956b0bf2a4', 4, true, 70),
        ('cd1592be-7302-4805-a172-86956b0bf2a4', 5, false, 100),
        ('cd1592be-7302-4805-a172-86956b0bf2a4', 6, true, 27)
) AS qp(student_id, question_id, is_correct, time_used) ON inserted_play_logs.student_id = qp.student_id;



-- UPDATE total_time, star
UPDATE "level".level_play_log lpl
SET
    time_used = subquery.total_time,
    star = subquery.star
FROM (
         SELECT
             qqpl.level_play_log_id,
             SUM(qqpl.time_used) AS total_time,
             SUM(CASE WHEN qqpl.is_correct THEN 1 ELSE 0 END) / 2 AS star
         FROM question.question_play_log qqpl
         GROUP BY qqpl.level_play_log_id
     ) AS subquery
WHERE lpl.id = subquery.level_play_log_id;