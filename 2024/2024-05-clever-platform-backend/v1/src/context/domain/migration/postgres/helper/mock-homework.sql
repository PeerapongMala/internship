BEGIN;

INSERT INTO "user"."user"
(id, email, title, first_name, last_name, status, created_at)
VALUES
('e2698584-16a0-45e9-8c4e-3169738eb5df', 'student5@student.com', 'เด็กชาย', 'student', 'student', 'enabled', '2025-03-09 08:32:04.162495'),
('d1b2baaa-377e-4bc1-bafd-3bfb7ed56204', 'pp@gmail.com', 'นาย', 'Bob', 'Abc', 'enabled', '2025-03-09 08:32:04.162495'),
('05a35f68-fa65-4b7a-917c-a2d64ef2c2e3', 'pv@gmail.com', 'นาย', 'Jane', 'Abc', 'enabled', '2025-03-09 08:32:04.162495'),
('05a35f68-fa65-4b7a-917c-a2d64ef2c2e4', 'teacher@gmail.com', 'นาย', 'Sam', 'Smith', 'enabled', '2025-03-09 08:32:04.162495');

INSERT INTO auth.auth_email_password
(user_id, password_hash)
VALUES
('e2698584-16a0-45e9-8c4e-3169738eb5df', '$2a$10$VVodbZx/nrmC9dc/9yIiMuMj9zR6HfFiiakgyaM4B1NImTYtAS7ye'),
('d1b2baaa-377e-4bc1-bafd-3bfb7ed56204', '$2a$10$gZEDLYGdEdKoAZMY5hBOQeqdebJqALpVYUBsQQOgmvusVdzwJ8diW'),
('05a35f68-fa65-4b7a-917c-a2d64ef2c2e3', '$2a$10$U7zKI5ZqwHMy1u3wSEODiuKlyanBt0vJQttrLND6DpG0Zn6HTaU2m'),
('05a35f68-fa65-4b7a-917c-a2d64ef2c2e4', '$2a$10$U7zKI5ZqwHMy1u3wSEODiuKlyanBt0vJQttrLND6DpG0Zn6HTaU2m');


INSERT INTO "user".student
(user_id, school_id, student_id, year)
VALUES
('e2698584-16a0-45e9-8c4e-3169738eb5df', 1, 17344, 'ป.5');

INSERT INTO "user".parent
(user_id, relationship)
VALUES
('d1b2baaa-377e-4bc1-bafd-3bfb7ed56204', 'dad'),
('05a35f68-fa65-4b7a-917c-a2d64ef2c2e3', 'mom');

INSERT INTO "user".user_role
(user_id, role_id)
VALUES
('e2698584-16a0-45e9-8c4e-3169738eb5df', 7),
('d1b2baaa-377e-4bc1-bafd-3bfb7ed56204', 8),
('05a35f68-fa65-4b7a-917c-a2d64ef2c2e3', 8),
('05a35f68-fa65-4b7a-917c-a2d64ef2c2e4', 6);

INSERT INTO school.school_teacher
(school_id, user_id)
VALUES
(1, '05a35f68-fa65-4b7a-917c-a2d64ef2c2e4');

-- Create subject

INSERT INTO curriculum_group.year
(id, curriculum_group_id, platform_id, seed_year_id, status, created_at, created_by)
VALUES
(2, 1, 1, 5, 'enabled', '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(3, 1, 1, 3, 'enabled', '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');


INSERT INTO curriculum_group.subject_group
(id, year_id, seed_subject_group_id, status, created_at, created_by)
VALUES
(2, 2, 1, 'enabled', '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(3, 2, 2, 'enabled', '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(4, 3, 1, 'enabled', '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT INTO subject.subject
(id, subject_group_id, name, subject_language_type, status, created_at, created_by)
VALUES
(2, 2, 'Math 5', 'custom', 'enabled', '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(3, 3, 'Eng 5', 'custom', 'enabled', '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(4, 4, 'Math 3', 'custom', 'enabled', '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT INTO school.school_subject
(contract_id, school_id, subject_id, is_enabled)
VALUES
(1, 1, 2, true),
(1, 1, 3, true),
(1, 1, 4, true);


-- Create class
INSERT INTO class.class
(id, school_id, academic_year, year, name, status, created_at, created_by)
VALUES
(2, 1, '2568', 'ป.5', '1', 'enabled', '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT INTO class.study_group
(id, subject_id, class_id, name, status,created_at, created_by)
VALUES
(2, 2, 2, 'Math 5/1 g1', 'enabled', '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT INTO class.study_group_student
(study_group_id, student_id)
VALUES
('2', 'e2698584-16a0-45e9-8c4e-3169738eb5df');

INSERT INTO school.class_student
(class_id, student_id)
VALUES
(2, 'e2698584-16a0-45e9-8c4e-3169738eb5df');

-- ----------------------------------------------------

INSERT INTO subject.lesson
(id, subject_id, "index", name, font_name, font_size, background_image_path, status, wizard_index, created_at, created_by)
VALUES
(2, 2, 1, 'Math 5 lesson 1', 'Noto Sans Thai', 'Size S - 14 pt', 'image path', 'enabled', 0, '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(3, 3, 1, 'Eng 5 lesson 1 ', 'Noto Sans Thai', 'Size S - 14 pt', 'image path', 'enabled', 0, '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(4, 4, 1, 'Math 3 lesson 1', 'Noto Sans Thai', 'Size S - 14 pt', 'image path', 'enabled', 0, '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT INTO "subject".sub_lesson
(id, lesson_id, "index", indicator_id, name, status, created_at, created_by)
VALUES
(2, 2, 1, 1, 'M5 L1 S1', 'enabled', '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(3, 2, 2, 1, 'M5 L1 S2', 'enabled', '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(4, 3, 1, 1, 'E5 L1 S1', 'enabled', '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(5, 4, 1, 1, 'M3 L1 S1', 'enabled', '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT INTO homework.homework_template
(id, subject_id, year_id, lesson_id, teacher_id, status, created_at, created_by) 
VALUES
(4, 2, 2, 2, '05a35f68-fa65-4b7a-917c-a2d64ef2c2e4', 'enabled', '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(5, 3, 2, 3, '05a35f68-fa65-4b7a-917c-a2d64ef2c2e4', 'enabled', '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(6, 4, 3, 4, '05a35f68-fa65-4b7a-917c-a2d64ef2c2e4', 'enabled', '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT INTO homework.homework
(id, name, subject_id, year_id, homework_template_id, started_at, due_at, closed_at, status, created_at, created_by)
VALUES
(4, 'M5', 2, 2, 4, '2024-12-16 06:50:07.699', '2024-12-16 06:50:07.699', '2024-12-16 06:50:07.699', 'enabled', '2024-12-16 06:50:07.699', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(5, 'E5', 3, 2, 5, '2024-12-16 06:50:07.699', '2024-12-16 06:50:07.699', '2024-12-16 06:50:07.699', 'enabled', '2024-12-16 06:50:07.699', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(6, 'M3', 4, 3, 6, '2024-12-16 06:50:07.699', '2024-12-16 06:50:07.699', '2024-12-16 06:50:07.699', 'enabled', '2024-12-16 06:50:07.699', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');


INSERT INTO level.level
(id, sub_lesson_id, "index", question_type, level_type, difficulty, lock_next_level, timer_type, timer_time, bloom_type, status, wizard_index, created_at, created_by)
VALUES
(4, 2, 1, 'multiple-choices', 'test', 'easy', FALSE, '', 0, 1, 'enabled', 1, '2024-12-16 06:50:07.699', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(5, 2, 2, 'multiple-choices', 'test', 'easy', FALSE, '', 0, 1, 'enabled', 1, '2024-12-16 06:50:07.699', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(6, 3, 1, 'multiple-choices', 'test', 'easy', FALSE, '', 0, 1, 'enabled', 1, '2024-12-16 06:50:07.699', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(7, 4, 1, 'multiple-choices', 'test', 'easy', FALSE, '', 0, 1, 'enabled', 1, '2024-12-16 06:50:07.699', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');


INSERT INTO homework.homework_template_level
(homework_template_id, level_id)
VALUES
(4, 4),
(4, 5),
(5, 7);

INSERT INTO homework.homework_assigned_to_class
(class_id, homework_id, assigned_at)
VALUES
(2, 4, '2025-02-25 00:00:00');

INSERT INTO homework.homework_assigned_to_study_group
(study_group_id, homework_id, assigned_at)
VALUES
(2,5,'2025-02-25 00:00:00');


INSERT INTO family.family
(id, created_at, created_by, status)
VALUES
(2, '2025-02-25 00:00:00', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', 'enabled');

INSERT INTO family.family_member
(family_id, user_id, is_owner)
VALUES
(2, 'e2698584-16a0-45e9-8c4e-3169738eb5df', false),
(2, 'd1b2baaa-377e-4bc1-bafd-3bfb7ed56204', true);
COMMIT;
