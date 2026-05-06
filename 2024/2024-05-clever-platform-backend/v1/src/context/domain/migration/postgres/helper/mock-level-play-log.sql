-- USING FOR TEST G03D04

-- INSERT teacher to School
INSERT INTO school.school_teacher
    (school_id, user_id)
VALUES (1, '00f1b13e-0e62-45d2-9718-099cd545b3ac');

-- INSERT LOG IN USER
INSERT INTO auth.auth_email_password(user_id, password_hash)
VALUES ('00f1b13e-0e62-45d2-9718-099cd545b3ac', '$2a$10$wwg4fOjgzpxJXRZYsv7O0u0/EFmv0nbsC.mQwW1siNzmxxPxo4SVy');

-- INSERT MOCK PLAY LOG
INSERT INTO "level".level_play_log
(class_id, student_id, level_id, homework_id, played_at, star, time_used, admin_login_as)
VALUES (1, 'cd1592be-7302-4805-a172-86956b0bf2a1', 2, NULL, '2025-02-01 12:47:19.821', 0, 0, NULL),
       (1, 'cd1592be-7302-4805-a172-86956b0bf2a1', 2, NULL, '2025-02-01 14:51:19.821', 0, 0, NULL),
       (1, 'cd1592be-7302-4805-a172-86956b0bf2a1', 2, NULL, '2025-02-04 16:51:19.821', 0, 0, NULL);

-- INSERT QUESTION PLAY LOG
INSERT INTO question.question_play_log
    (level_play_log_id, question_id, is_correct, time_used)
VALUES (1, 1, TRUE, 20),
       (1, 2, FALSE, 30),
       (1, 3, FALSE, 32),
       (1, 4, FALSE, 34),
       (1, 5, FALSE, 10),
       (1, 6, TRUE, 10),

       (2, 1, TRUE, 20),
       (2, 2, TRUE, 30),
       (2, 3, TRUE, 32),
       (2, 4, TRUE, 70),
       (2, 5, TRUE, 20),
       (2, 6, TRUE, 30),

       (3, 1, TRUE, 20),
       (3, 2, TRUE, 30),
       (3, 3, FALSE, 90),
       (3, 4, TRUE, 3),
       (3, 5, FALSE, 100),
       (3, 6, TRUE, 10);

-- UPDATE total_time, star
UPDATE "level".level_play_log lpl
SET time_used = subquery.total_time,
    star      = subquery.star
FROM (SELECT qqpl.level_play_log_id,
             SUM(qqpl.time_used)                                  AS total_time,
             SUM(CASE WHEN qqpl.is_correct THEN 1 ELSE 0 END) / 2 AS star
      FROM question.question_play_log qqpl
      GROUP BY qqpl.level_play_log_id) AS subquery
WHERE lpl.id = subquery.level_play_log_id;

INSERT INTO question.student_multiple_choice_answer (question_play_log_id, question_multiple_choice_text_choice_id,
                                                     question_multiple_choice_image_choice_id)
VALUES (1, 1, NULL),
       (2, 7, NULL);

INSERT INTO question.student_group_answer (question_play_log_id, question_group_choice_id, question_group_group_id)
VALUES (4, 2, 2),
       (4, 9, 3),
       (4, 8, 3);

INSERT INTO question.student_sort_answer (question_play_log_id, question_sort_text_choice_id, "index")
VALUES (3, 6, 1),
       (3, 1, 2),
       (3, 2, 3),
       (3, 3, 4);

INSERT INTO question.student_placeholder_answer (question_play_log_id, question_placeholder_answer_id,
                                                 question_placeholder_text_choice_id)
VALUES (5, 1, 3);

INSERT INTO question.student_input_answer (question_play_log_id, question_input_answer_id, answer_index, answer)
VALUES (6, 2, 2, 'shoes'),
       (6, 1, 1, 'Gloves'),
       (6, 3, 1, 'Morning'),
       (6, 4, 2, 'you');

