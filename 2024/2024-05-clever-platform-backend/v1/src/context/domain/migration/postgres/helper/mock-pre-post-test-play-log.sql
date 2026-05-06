-- 'cd1592be-7302-4805-a172-86956b0bf2a1',
-- 'cd1592be-7302-4805-a172-86956b0bf2a2',
-- 'cd1592be-7302-4805-a172-86956b0bf2a3',
-- 'cd1592be-7302-4805-a172-86956b0bf2a4'



WITH cte as (
    SELECT level.id
    FROM level.level
    WHERE level_type = 'pre-post-test'
)

INSERT INTO "level"."level_play_log" (
    class_id,
    student_id,
    level_id,
    homework_id,
    played_at,
    star,
    time_used,
    admin_login_as
)
VALUES
    (1, 'cd1592be-7302-4805-a172-86956b0bf2a1', (SELECT id FROM cte), NULL, now() - interval '1 month', 0, 0, NULL),
    (1, 'cd1592be-7302-4805-a172-86956b0bf2a2', (SELECT id FROM cte), NULL, now() - interval '1 month', 0, 0, NULL),
    (1, 'cd1592be-7302-4805-a172-86956b0bf2a3', (SELECT id FROM cte), NULL, now() - interval '1 month', 0, 0, NULL),
    (1, 'cd1592be-7302-4805-a172-86956b0bf2a4', (SELECT id FROM cte), NULL, now() - interval '1 month', 0, 0, NULL),

    (1, 'cd1592be-7302-4805-a172-86956b0bf2a1', (SELECT id FROM cte), NULL, now(), 0, 0, NULL),
    (1, 'cd1592be-7302-4805-a172-86956b0bf2a2', (SELECT id FROM cte), NULL, now(), 0, 0, NULL),
    (1, 'cd1592be-7302-4805-a172-86956b0bf2a3', (SELECT id FROM cte), NULL, now(), 0, 0, NULL),
    (1, 'cd1592be-7302-4805-a172-86956b0bf2a4', (SELECT id FROM cte), NULL, now(), 0, 0, NULL);

INSERT INTO question.question_play_log (level_play_log_id, question_id, is_correct, time_used)
VALUES
        --         Pre
        (8, 8, true, 20),
        (8, 9, false, 30),
        (8, 10, false, 32),
        (8, 11, false, 34),
        (8, 12, false, 10),
        (8, 13, true, 10),

        (9, 8, true, 20),
        (9, 9, true, 30),
        (9, 10, true, 32),
        (9, 11, true, 70),
        (9, 12, true, 20),
        (9, 13, true, 30),

        (10, 8, true, 20),
        (10, 9, true, 30),
        (10, 10, false, 90),
        (10, 11, true, 3),
        (10, 12, false, 100),
        (10, 13, true, 10),

        (11, 8, true, 100),
        (11, 9, true, 30),
        (11, 10, true, 60),
        (11, 11, true, 70),
        (11, 12, false, 100),
        (11, 13, true, 27),

        --         POST
        (12, 8, true, 20),
        (12, 9, false, 30),
        (12, 10, true, 32),
        (12, 11, true, 34),
        (12, 12, true, 10),
        (12, 13, true, 10),

        (13, 8, true, 20),
        (13, 9, true, 30),
        (13, 10, true, 32),
        (13, 11, true, 70),
        (13, 12, true, 20),
        (13, 13, true, 30),

        (14, 8, true, 20),
        (14, 9, true, 30),
        (14, 10, true, 90),
        (14, 11, true, 3),
        (14, 12, true, 100),
        (14, 13, true, 10),

        (15, 8, true, 100),
        (15, 9, true, 30),
        (15, 10, true, 60),
        (15, 11, true, 70),
        (15, 12, false, 100),
        (15, 13, true, 27);

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