BEGIN;

INSERT INTO "user"."user"
(id, email, title, first_name, last_name, status, created_at)
VALUES
('e2698584-16a0-45e9-8c4e-3169738eb5df', 'student5@student.com', 'เด็กชาย', 'student', 'student', 'enabled', '2025-03-09 08:32:04.162495'),
('05a35f68-fa65-4b7a-917c-a2d64ef2c2e4', 'teacher@gmail.com', 'นาย', 'Sam', 'Smith', 'enabled', '2025-03-09 08:32:04.162495');

INSERT INTO auth.auth_email_password
(user_id, password_hash)
VALUES
('e2698584-16a0-45e9-8c4e-3169738eb5df', '$2a$10$VVodbZx/nrmC9dc/9yIiMuMj9zR6HfFiiakgyaM4B1NImTYtAS7ye'),
('05a35f68-fa65-4b7a-917c-a2d64ef2c2e4', '$2a$10$VVodbZx/nrmC9dc/9yIiMuMj9zR6HfFiiakgyaM4B1NImTYtAS7ye');
INSERT INTO "user".student
(user_id, school_id, student_id, year)
VALUES
('e2698584-16a0-45e9-8c4e-3169738eb5df', 1, 17344, 'ป.5');
INSERT INTO "user".user_role
(user_id, role_id)
VALUES
('e2698584-16a0-45e9-8c4e-3169738eb5df', 7),
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

INSERT INTO subject.subject_teacher
(id, subject_id, teacher_id, academic_year)
VALUES
(2, 3, 'ba4582e8-2943-4be3-a699-60d8014f6396', 2568),
(3, 2, '05a35f68-fa65-4b7a-917c-a2d64ef2c2e4', 2568);

-- ------ Chat Message ------
INSERT INTO message.messages
(id, room_id, sender_id, content, created_at, room_type, school_id, receiver_id)
VALUES
(1, 'f28e8e9d', '05a35f68-fa65-4b7a-917c-a2d64ef2c2e4', 'First message from teacher', '2024-11-18 17:25:19.821779', 'private', 1, 'e2698584-16a0-45e9-8c4e-3169738eb5df'),
(2, 'f28e8e9d', 'e2698584-16a0-45e9-8c4e-3169738eb5df', 'Response from student', '2024-11-18 17:25:19.821779', 'private', 1, '05a35f68-fa65-4b7a-917c-a2d64ef2c2e4');

COMMIT;