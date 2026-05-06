BEGIN;

INSERT INTO "user"."user"
(id, email, title, first_name, last_name, status, created_at)
VALUES
('e2698584-16a0-45e9-8c4e-3169738eb8df', 'student8@student.com', 'เด็กชาย', 'student8', 'student8', 'enabled', '2025-03-09 08:32:04.162495'),
('e2698584-16a0-45e9-8c4e-3169738eb6df', 'student9@student.com', 'เด็กชาย', 'student9', 'student9', 'enabled', '2025-03-09 08:32:04.162495'),
('e2698584-16a0-45e9-8c4e-3169738eb7df', 'student7@student.com', 'เด็กชาย', 'student7', 'student7', 'enabled', '2025-03-09 08:32:04.162495'),
('d1b2baaa-377e-4bc1-bafd-3bfb7ed56205', 'ppp@gmail.com', 'นาย', 'ppp', 'ppp', 'enabled', '2025-03-09 08:32:04.162495'),
('05a35f68-fa65-4b7a-917c-a2d64ef2c2a3', 'pvv@gmail.com', 'นาย', 'pvv', 'pvv', 'enabled', '2025-03-09 08:32:04.162495'),
('05a35f68-fa65-4b7a-917c-a2d64ef2c2q4', 'paa@gmail.com', 'นาย', 'paa', 'paa', 'enabled', '2025-03-09 08:32:04.162495');

INSERT INTO "user".student
(user_id, school_id, student_id, year)
VALUES
('e2698584-16a0-45e9-8c4e-3169738eb8df', 1, 1734, 'ป.5'),
('e2698584-16a0-45e9-8c4e-3169738eb6df', 1, 17346, 'ป.5'),
('e2698584-16a0-45e9-8c4e-3169738eb7df', 1, 17347, 'ป.5');

INSERT INTO "user".parent
(user_id, relationship)
VALUES
('d1b2baaa-377e-4bc1-bafd-3bfb7ed56205', 'dad'),
('05a35f68-fa65-4b7a-917c-a2d64ef2c2q4', 'dad'),
('05a35f68-fa65-4b7a-917c-a2d64ef2c2a3', 'mom');


INSERT INTO "user".user_role
(user_id, role_id)
VALUES
('e2698584-16a0-45e9-8c4e-3169738eb8df', 7),
('e2698584-16a0-45e9-8c4e-3169738eb6df', 7),
('e2698584-16a0-45e9-8c4e-3169738eb7df', 7),
('d1b2baaa-377e-4bc1-bafd-3bfb7ed56205', 8),
('05a35f68-fa65-4b7a-917c-a2d64ef2c2a3', 8),
('05a35f68-fa65-4b7a-917c-a2d64ef2c2q4', 8);

INSERT INTO family.family
(id, created_at, created_by, status)
VALUES
(10, '2025-03-15 16:42:50.564159','1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', 'enabled');

INSERT INTO family.family_member
(family_id, user_id, is_owner)
VALUES
(10, 'e2698584-16a0-45e9-8c4e-3169738eb8df', false),
(10, 'd1b2baaa-377e-4bc1-bafd-3bfb7ed56205', false),
(10, '05a35f68-fa65-4b7a-917c-a2d64ef2c2a3', true);

INSERT INTO class.class
(id, school_id, academic_year, year, name, status, created_at, created_by)
VALUES
(2, 1, '2568', 'ป.5', '1', 'enabled', '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(3, 1, '2568', 'ป.5', '2', 'enabled', '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(4, 1, '2568', 'ป.4', '1', 'enabled', '2024-11-18 17:25:19.821779', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');


INSERT INTO school.class_student
(class_id, student_id)
VALUES
(2, 'e2698584-16a0-45e9-8c4e-3169738eb6df'),
(2, 'e2698584-16a0-45e9-8c4e-3169738eb7df');

INSERT INTO school.seed_academic_year
(academic_year)
VALUES
(2567),
(2568);

COMMIT;