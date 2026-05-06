INSERT INTO "user"."user"
(id, email, title, first_name, last_name, id_number, image_url, status, created_at, created_by, updated_at, updated_by, last_login)
VALUES('abf26314-a541-4e39-8fff-ed5aa78a2782', 'teacher1@admin.com', 'Mr', 'ครู1', 'ครู1', NULL, NULL, 'enabled', '2024-10-26 15:06:21.000', NULL, NULL, NULL, NULL);
INSERT INTO "user"."user"
(id, email, title, first_name, last_name, id_number, image_url, status, created_at, created_by, updated_at, updated_by, last_login)
VALUES('ba4582e8-2943-4be3-a699-60d8014f6395', 'teacher2@admin.com', 'Mr', 'ครู2', 'ครู2', NULL, NULL, 'enabled', '2024-10-26 15:06:21.000', NULL, NULL, NULL, NULL);
INSERT INTO "user"."user"
(id, email, title, first_name, last_name, id_number, image_url, status, created_at, created_by, updated_at, updated_by, last_login)
VALUES('e2e684b7-8761-4a96-8be5-4ca93dfc970b', 'teacher3@admin.com', 'Mr', 'ครู3', 'ครู3', NULL, NULL, 'enabled', '2024-10-26 15:06:21.000', NULL, NULL, NULL, NULL);
INSERT INTO "user"."user"
(id, email, title, first_name, last_name, id_number, image_url, status, created_at, created_by, updated_at, updated_by, last_login)
VALUES('ba4582e8-2943-4be3-a699-60d8014f6396', 'teacher4@admin.com', 'Mr', 'ครู4', 'ครู4', NULL, NULL, 'enabled', '2024-10-26 15:06:21.000', NULL, NULL, NULL, NULL);

INSERT INTO school.school_teacher
(school_id, user_id)
VALUES(1, 'abf26314-a541-4e39-8fff-ed5aa78a2782');
INSERT INTO school.school_teacher
(school_id, user_id)
VALUES(1, 'ba4582e8-2943-4be3-a699-60d8014f6395');
INSERT INTO school.school_teacher
(school_id, user_id)
VALUES(1, 'e2e684b7-8761-4a96-8be5-4ca93dfc970b');
INSERT INTO school.school_teacher
(school_id, user_id)
VALUES(1, 'ba4582e8-2943-4be3-a699-60d8014f6396');

INSERT INTO grade.evaluation_form
(school_id, template_id, academic_year, "year", school_room, school_term, is_lock, status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES(1, 1, '2567', 'ชั้น ป.1', 'ห้อง 1', 'ซัมเมอร์', NULL, 'enabled', '2025-01-04 07:40:54.214', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2025-01-04 07:40:54.214', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', NULL);
INSERT INTO grade.evaluation_form
(school_id, template_id, academic_year, "year", school_room, school_term, is_lock, status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES(1, 1, '2567', 'ชั้น ป.1', 'ห้อง 2', 'ซัมเมอร์', NULL, 'enabled', '2025-01-04 07:41:19.710', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2025-01-04 07:41:19.710', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', NULL);
INSERT INTO grade.evaluation_form
(school_id, template_id, academic_year, "year", school_room, school_term, is_lock, status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES(1, 1, '2567', 'ชั้น ป.1', 'ห้อง 3', 'ซัมเมอร์', NULL, 'enabled', '2025-01-04 07:41:21.630', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2025-01-04 07:41:21.630', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', NULL);

INSERT INTO grade.evaluation_form_subject
(form_id, template_subject_id)
VALUES(1, 1);
INSERT INTO grade.evaluation_form_subject
(form_id, template_subject_id)
VALUES(1, 2);

INSERT INTO grade.evaluation_form_indicator
(evaluation_form_subject_id, name, weight, sort)
VALUES(1, 'จำนวนนับที่มากกว่า 100,000', 30, 1);
INSERT INTO grade.evaluation_form_indicator
(evaluation_form_subject_id, name, weight, sort)
VALUES(1, 'เศษส่วน', 20, 2);
INSERT INTO grade.evaluation_form_indicator
(evaluation_form_subject_id, name, weight, sort)
VALUES(1, 'ทศนิยม', 20, 3);
INSERT INTO grade.evaluation_form_indicator
(evaluation_form_subject_id, name, weight, sort)
VALUES(1, 'การบวกลบคูณหาร', 30, 4);
INSERT INTO grade.evaluation_form_indicator
(evaluation_form_subject_id, name, weight, sort)
VALUES(2, 'ฟิสิกส์ควอนตัม', 30, 1);

INSERT INTO grade.evaluation_form_general_evaluation
(form_id, template_type, template_name)
VALUES(1, 'เวลาเรียน', 'เวลาเรียนประถม');
INSERT INTO grade.evaluation_form_general_evaluation
(form_id, template_type, template_name)
VALUES(1, 'คุณลักษณะอันพึงประสงค์', 'คุณลักษณะอันพึงประสงค์ ประถม');
INSERT INTO grade.evaluation_form_general_evaluation
(form_id, template_type, template_name)
VALUES(1, 'สมรรถนะ', 'กิจกรรมพัฒนาผู้เรียน ประถม');
INSERT INTO grade.evaluation_form_general_evaluation
(form_id, template_type, template_name)
VALUES(1, 'กิจกรรมพัฒนาผู้เรียน', 'กิจกรรมพัฒนาผู้เรียน ประถม');

INSERT INTO grade.evaluation_form_additional_person
(form_id, value_type, value_id, user_type, user_id)
VALUES(1, 'GENERAL_EVALUATION', 1, 'teacher', 'abf26314-a541-4e39-8fff-ed5aa78a2782');
INSERT INTO grade.evaluation_form_additional_person
(form_id, value_type, value_id, user_type, user_id)
VALUES(1, 'GENERAL_EVALUATION', 2, 'teacher', 'abf26314-a541-4e39-8fff-ed5aa78a2782');
INSERT INTO grade.evaluation_form_additional_person
(form_id, value_type, value_id, user_type, user_id)
VALUES(1, 'SUBJECT', 1, 'teacher', 'e2e684b7-8761-4a96-8be5-4ca93dfc970b');