INSERT INTO curriculum_group.curriculum_group
("name", short_name, status, created_at, created_by)
VALUES('มหาวิทยาลัยราชภัฎสวนสุนันทา', 'มรภ. สวนสุนันทา', 'enabled', '2024-11-18T17:25:19.821779Z', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT INTO grade."template"
(school_id, year, template_name, active_flag, "version", status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES(1, 'ชั้น ป.1', 'ใบประเมินรายวิชา ป.1', true, '0.1', 'enabled', '2024-12-23 15:05:00.819', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2024-12-23 15:05:00.819', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT INTO grade.template_subject
(template_id, subject_name, is_clever, clever_subject_id, clever_subject_name)
VALUES(1, 'คณิตศาสตร์', false, NULL, NULL);

INSERT INTO grade.template_subject
(template_id, subject_name, is_clever, clever_subject_id, clever_subject_name)
VALUES(1, 'วิทยาศาสตร์', false, NULL, NULL);

INSERT INTO grade.template_indicator
(template_subject_id, name, weight, sort)
VALUES(1, 'จำนวนนับที่มากกว่า 100,000', 30, 1);
INSERT INTO grade.template_indicator

(template_subject_id, name, weight, sort)
VALUES(1, 'เศษส่วน', 20, 2);
INSERT INTO grade.template_indicator
(template_subject_id, name, weight, sort)
VALUES(1, 'ทศนิยม', 20, 3);
INSERT INTO grade.template_indicator
(template_subject_id, name, weight, sort)
VALUES(1, 'การบวกลบคูณหาร', 30, 4);
INSERT INTO grade.template_indicator
(template_subject_id, name, weight, sort)
VALUES(2, 'ฟิสิกส์ควอนตัม', 30, 1);

INSERT INTO grade.template_assessment_setting
(template_indicator_id, evaluation_key, evaluation_topic, value, weight)
VALUES(1, 'STAGE_LIST', 'ด่านประเมินก่อนเรียน', '[1, 7,8]', 10);
INSERT INTO grade.template_assessment_setting
(template_indicator_id, evaluation_key, evaluation_topic, value, weight)
VALUES(1, 'STAGE_LIST', 'ด่านง่าย', '[11]', 10);
INSERT INTO grade.template_assessment_setting
(template_indicator_id, evaluation_key, evaluation_topic, value, weight)
VALUES(1, 'AFFECTIVE', 'จิตพิสัยสาระการเรียนรู้', 'พฤติกรรม: สงการบ้าน', 10);
INSERT INTO grade.template_assessment_setting
(template_indicator_id, evaluation_key, evaluation_topic, value, weight)
VALUES(1, 'AFFECTIVE', 'จิตพิสัยสาระการเรียนรู้', 'พฤติกรรม: การล็อกอิน', 10);

INSERT INTO grade.general_template
(school_id, template_type, template_name, status, active_flag, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES(1, 'เวลาเรียน', 'เวลาเรียนประถม', 'enabled', true, '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
INSERT INTO grade.general_template
(school_id, template_type, template_name, status, active_flag, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES(1, 'เวลาเรียน', 'เวลาเรียนมัธยม', 'enabled', true, '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
INSERT INTO grade.general_template
(school_id, template_type, template_name, status, active_flag, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES(1, 'คุณลักษณะอันพึงประสงค์', 'คุณลักษณะอันพึงประสงค์ ประถม', 'enabled', true, '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
INSERT INTO grade.general_template
(school_id, template_type, template_name, status, active_flag, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES(1, 'คุณลักษณะอันพึงประสงค์', 'คุณลักษณะอันพึงประสงค์ มัธยม', 'enabled', true, '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
INSERT INTO grade.general_template
(school_id, template_type, template_name, status, active_flag, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES(1, 'สมรรถนะ', 'สมรรถนะ ประถม', 'enabled', true, '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
INSERT INTO grade.general_template
(school_id, template_type, template_name, status, active_flag, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES(1, 'สมรรถนะ', 'สมรรถนะ มัธยม', 'enabled', true, '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
INSERT INTO grade.general_template
(school_id, template_type, template_name, status, active_flag, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES(1, 'กิจกรรมพัฒนาผู้เรียน', 'กิจกรรมพัฒนาผู้เรียน ประถม', 'enabled', true, '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
INSERT INTO grade.general_template
(school_id, template_type, template_name, status, active_flag, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES(1, 'กิจกรรมพัฒนาผู้เรียน', 'กิจกรรมพัฒนาผู้เรียน มัธยม', 'enabled', true, '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT INTO grade.template_general_evaluation
(template_id, template_type, template_name)
VALUES(1, 'เวลาเรียน', 'เวลาเรียนประถม');
INSERT INTO grade.template_general_evaluation
(template_id, template_type, template_name)
VALUES(1, 'คุณลักษณะอันพึงประสงค์', 'คุณลักษณะอันพึงประสงค์ ประถม');
INSERT INTO grade.template_general_evaluation
(template_id, template_type, template_name)
VALUES(1, 'สมรรถนะ', 'กิจกรรมพัฒนาผู้เรียน ประถม');
INSERT INTO grade.template_general_evaluation
(template_id, template_type, template_name)
VALUES(1, 'กิจกรรมพัฒนาผู้เรียน', 'กิจกรรมพัฒนาผู้เรียน ประถม');

