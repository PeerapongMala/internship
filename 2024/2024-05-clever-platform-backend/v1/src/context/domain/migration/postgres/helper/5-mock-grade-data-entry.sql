-- mock template
INSERT INTO grade."template"
( school_id, year, template_name, active_flag, "version", status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES( 1, 'ป.1', 'ใบประเมินรายวิชา ป.1', true, '0.1', 'enabled', '2024-12-23 15:05:00.819', '00f1b13e-0e62-45d2-9718-099cd545b3ac', '2024-12-23 15:05:00.819', '00f1b13e-0e62-45d2-9718-099cd545b3ac', '00f1b13e-0e62-45d2-9718-099cd545b3ac');

-- mock subject and general
INSERT INTO grade.template_subject
( template_id, subject_name, is_clever, clever_subject_id, clever_subject_name, hours)
VALUES(1, 'คณิตศาสตร์', false, NULL, NULL, 100);

INSERT INTO grade.template_subject
(template_id, subject_name, is_clever, clever_subject_id, clever_subject_name, hours)
VALUES(1, 'วิทยาศาสตร์', false, NULL, NULL, 100);

INSERT INTO grade.template_indicator
(template_subject_id, name, max_value, sort)
VALUES(1, 'จำนวนนับที่มากกว่า 100,000', 30, 1);
INSERT INTO grade.template_indicator
(template_subject_id, name, max_value, sort)
VALUES(1, 'เศษส่วน', 20, 2);
INSERT INTO grade.template_indicator
(template_subject_id, name, max_value, sort)
VALUES(1, 'ทศนิยม', 20, 3);
INSERT INTO grade.template_indicator
(template_subject_id, name, max_value, sort)
VALUES(1, 'การบวกลบคูณหาร', 30, 4);
INSERT INTO grade.template_indicator
(template_subject_id, name, max_value, sort)
VALUES(2, 'ฟิสิกส์ควอนตัม', 30, 1);

INSERT INTO grade.template_assessment_setting
(template_indicator_id, evaluation_key, evaluation_topic, value, weight)
VALUES(1, 'STAGE_LIST', 'ด่านประเมินก่อนเรียน', '[1,7,8]', 10);
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
VALUES(1, 'คุณลักษณะอันพึงประสงค์', 'คุณลักษณะอันพึงประสงค์ ประถม', 'enabled', true, '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
INSERT INTO grade.general_template
(school_id, template_type, template_name, status, active_flag, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES(1, 'คุณลักษณะอันพึงประสงค์', 'คุณลักษณะอันพึงประสงค์ มัธยม', 'enabled', true, '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
INSERT INTO grade.general_template
(school_id, template_type, template_name, status, active_flag, created_at, created_by, updated_at, updated_by, admin_login_as, additional_data)
VALUES(1, 'เวลาเรียน', 'เวลาเรียนประถม', 'enabled', true, '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '{"hours": 200,"start_date": "2024-12-23","end_date": "2024-12-23"}');
INSERT INTO grade.general_template
(school_id, template_type, template_name, status, active_flag, created_at, created_by, updated_at, updated_by, admin_login_as, additional_data)
VALUES(1, 'เวลาเรียน', 'เวลาเรียนมัธยม', 'enabled', true, '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '{"hours": 200,"start_date": "2024-12-23","end_date": "2024-12-23"}');
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

INSERT INTO grade.general_template
(school_id, template_type, template_name, status, active_flag, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES(1, 'ภาวะโภชนาการ', 'ภาวะโภชนาการ ประถม', 'enabled', true, '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
INSERT INTO grade.general_template
(school_id, template_type, template_name, status, active_flag, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES(1, 'ภาวะโภชนาการ', 'ภาวะโภชนาการ มัธยม', 'enabled', true, '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2024-12-23 18:27:47.761', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');


INSERT INTO grade.template_general_evaluation
(template_id, template_type, template_name)
VALUES(1, 'คุณลักษณะอันพึงประสงค์', 'คุณลักษณะอันพึงประสงค์ ประถม');
INSERT INTO grade.template_general_evaluation
(template_id, template_type, template_name, additional_data)
VALUES(1, 'เวลาเรียน', 'เวลาเรียนประถม','{"hours": 200,"start_date": "2024-12-23","end_date": "2024-12-23"}');
INSERT INTO grade.template_general_evaluation
(template_id, template_type, template_name)
VALUES(1, 'สมรรถนะ', 'กิจกรรมพัฒนาผู้เรียน ประถม');
INSERT INTO grade.template_general_evaluation
(template_id, template_type, template_name)
VALUES(1, 'กิจกรรมพัฒนาผู้เรียน', 'กิจกรรมพัฒนาผู้เรียน ประถม');
INSERT INTO grade.template_general_evaluation
(template_id, template_type, template_name)
VALUES(1, 'ภาวะโภชนาการ', 'ภาวะโภชนาการ ประถม');

-- mock form, include subject, general and student list
INSERT INTO grade.evaluation_form ( school_id, template_id, academic_year, year, school_room, school_term, is_lock, status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES (1, 1, '2567', 'ป.1', 'ห้อง 4', 'เทอม 1', null, 'in_progress', '2025-01-04 07:40:54.214000','00f1b13e-0e62-45d2-9718-099cd545b3ac', '2025-01-04 07:40:54.214000', '00f1b13e-0e62-45d2-9718-099cd545b3ac', null);
INSERT INTO grade.evaluation_form
(school_id, template_id, academic_year, "year", school_room, school_term, is_lock, status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES(1, 1, '2567', 'ป.1', 'ห้อง 1', 'เทอม 2', NULL, 'in_progress', '2025-01-04 07:40:54.214', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2025-01-04 07:40:54.214', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', NULL);
INSERT INTO grade.evaluation_form
(school_id, template_id, academic_year, "year", school_room, school_term, is_lock, status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES(1, 1, '2567', 'ป.1', 'ห้อง 2', 'เทอม 1', NULL, 'in_progress', '2025-01-04 07:41:19.710', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2025-01-04 07:41:19.710', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', NULL);
INSERT INTO grade.evaluation_form
(school_id, template_id, academic_year, "year", school_room, school_term, is_lock, status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES(1, 1, '2567', 'ป.1', 'ห้อง 3', 'เทอม 2', NULL, 'in_progress', '2025-01-04 07:41:21.630', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2025-01-04 07:41:21.630', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', NULL);

INSERT INTO grade.evaluation_form_subject (form_id, template_subject_id)
VALUES (1, 1);
INSERT INTO grade.evaluation_form_subject (form_id, template_subject_id)
VALUES (1, 1);

INSERT INTO grade.evaluation_form_indicator
(evaluation_form_subject_id, name, max_value, sort, score_evaluation_type)
VALUES(1, 'จำนวนนับที่มากกว่า 100,000', 30, 1, 'ACADEMIC_CRITERIA');
INSERT INTO grade.evaluation_form_indicator
(evaluation_form_subject_id, name, max_value, sort, score_evaluation_type)
VALUES(1, 'เศษส่วน', 20, 2, 'TEACHER_CRITERIA');
INSERT INTO grade.evaluation_form_indicator
(evaluation_form_subject_id, name, max_value, sort, score_evaluation_type)
VALUES(1, 'ทศนิยม', 20, 3, 'NO_CRITERIA');
INSERT INTO grade.evaluation_form_indicator
(evaluation_form_subject_id, name, max_value, sort, score_evaluation_type)
VALUES(1, 'การบวกลบคูณหาร', 30, 4, 'NO_CRITERIA');
INSERT INTO grade.evaluation_form_indicator
(evaluation_form_subject_id, name, max_value, sort, score_evaluation_type)
VALUES(2, 'ฟิสิกส์ควอนตัม', 30, 1, 'NO_CRITERIA');

INSERT INTO grade.evaluation_form_general_evaluation ( form_id, template_type, template_name)
VALUES (1, 'คุณลักษณะอันพึงประสงค์', 'คุณลักษณะอันพึงประสงค์ ประถม');
INSERT INTO grade.evaluation_form_general_evaluation
(form_id, template_type, template_name, additional_data)
VALUES(1, 'เวลาเรียน', 'เวลาเรียนประถม', '{"hours": 200,"start_date": "2024-12-23","end_date": "2024-12-23"}');
INSERT INTO grade.evaluation_form_general_evaluation
(form_id, template_type, template_name)
VALUES(1, 'สมรรถนะ', 'กิจกรรมพัฒนาผู้เรียน ประถม');
INSERT INTO grade.evaluation_form_general_evaluation
(form_id, template_type, template_name)
VALUES(1, 'กิจกรรมพัฒนาผู้เรียน', 'กิจกรรมพัฒนาผู้เรียน ประถม');

INSERT INTO grade.evaluation_form_additional_person
(form_id, value_type, value_id, user_type, user_id)
VALUES(1, 'GENERAL_EVALUATION', 1, 'teacher', '21ceee5d-ee10-462b-a1e3-659a2187ca95');
INSERT INTO grade.evaluation_form_additional_person
(form_id, value_type, value_id, user_type, user_id)
VALUES(1, 'GENERAL_EVALUATION', 2, 'teacher', '21ceee5d-ee10-462b-a1e3-659a2187ca95');
INSERT INTO grade.evaluation_form_additional_person
(form_id, value_type, value_id, user_type, user_id)
VALUES(1, 'SUBJECT', 1, 'teacher', '21ceee5d-ee10-462b-a1e3-659a2187ca95');

INSERT INTO grade.evaluation_student (
    form_id, citizen_no, student_id, title, thai_first_name,
    thai_last_name, eng_first_name, eng_last_name, birth_date, nationality,
    religion, parent_marital_status, gender, ethnicity, father_title,
    father_first_name, father_last_name, mother_title, mother_first_name,
    mother_last_name, guardian_relation, guardian_title, guardian_first_name,
    guardian_last_name, address_no, address_moo, address_sub_district,
    address_district, address_province, address_postal_code
)
VALUES (
           1, '1234567890123', '17330', 'เด็กชาย', 'สมชาย', 'รักเรียน', 'Somchai',
           'Rukrian', '2005-01-01', 'Thai', 'Buddhism', 'married', 'Male', 'Thai',
           'Mr.', 'สมพงษ์', 'รักเรียน', 'Mrs.', 'สมศรี', 'รักเรียน', 'บิดา',
           'Mr.', 'สมพงษ์', 'รักเรียน', '99/1', '5', 'ตำบลทดสอบ', 'อำเภอทดสอบ',
           'จังหวัดทดสอบ', '10110'
       );

-- mock sheet and data entry
INSERT INTO grade.evaluation_sheet ( form_id, value_type, evaluation_form_subject_id,
                                    evaluation_form_general_evaluation_id, is_lock, status, created_at, created_by,
                                    updated_at, updated_by, admin_login_as)
VALUES ( 1, 0, 1, null, false, 'enabled', '2025-01-24 17:41:52.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac',
        '2025-01-24 17:41:50.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac', null);

INSERT INTO grade.evaluation_sheet ( form_id, value_type, evaluation_form_subject_id,
                                    evaluation_form_general_evaluation_id, is_lock, status, created_at, created_by,
                                    updated_at, updated_by, admin_login_as)
VALUES ( 1, 1, null, 1, false, 'enabled', '2025-01-24 17:41:52.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac',
        '2025-01-24 17:41:50.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac', null);

INSERT INTO grade.evaluation_data_entry ( sheet_id, version, json_student_score_data, status, is_lock, created_at,
                                         created_by, updated_at, updated_by)
VALUES (2, '1', '[{
    "evaluation_student_id": 1,
    "student_indicator_data": [
        {
            "indicator_id": null,
            "indicator_general_name": "หัวข้อ",
            "value": 95.5
        }
    ],
    "additional_fields": {}
}]', 'draft', false, '2025-01-24 17:44:35.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac',
        '2025-01-24 17:44:42.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac');
UPDATE grade.evaluation_sheet
SET current_data_entry_id = 1
WHERE id = 2;

-- mock data for porphor5
INSERT INTO grade.evaluation_form ( school_id, template_id, academic_year, year, school_room, school_term, is_lock,
                                    status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES (1, 1, '2567', 'ป.1', 'ห้อง 4', 'เทอม 1', null, 'report_available', '2025-01-04 07:40:54.214000',
        '00f1b13e-0e62-45d2-9718-099cd545b3ac', '2025-01-04 07:40:54.214000', '00f1b13e-0e62-45d2-9718-099cd545b3ac',
        null);

INSERT INTO grade.evaluation_form_subject (form_id, template_subject_id)
VALUES (5, 1);
INSERT INTO grade.evaluation_form_indicator
(evaluation_form_subject_id, name, max_value, sort, score_evaluation_type)
VALUES(3, 'จำนวนนับที่มากกว่า 100,000', 30, 1, 'ACADEMIC_CRITERIA');
INSERT INTO grade.evaluation_form_indicator
(evaluation_form_subject_id, name, max_value, sort, score_evaluation_type)
VALUES(3, 'เศษส่วน', 20, 2, 'TEACHER_CRITERIA');
INSERT INTO grade.evaluation_form_indicator
(evaluation_form_subject_id, name, max_value, sort, score_evaluation_type)
VALUES(3, 'ทศนิยม', 20, 3, 'NO_CRITERIA');
INSERT INTO grade.evaluation_form_indicator
(evaluation_form_subject_id, name, max_value, sort, score_evaluation_type)
VALUES(3, 'การบวกลบคูณหาร', 30, 4, 'NO_CRITERIA');

INSERT INTO grade.evaluation_form_setting
(evaluation_form_indicator_id, evaluation_key, evaluation_topic, value, weight)
VALUES (6, 'STAGE_LIST', 'ด่านประเมินก่อนเรียน', '[1]', 10);
INSERT INTO grade.evaluation_form_setting
(evaluation_form_indicator_id, evaluation_key, evaluation_topic, value, weight)
VALUES (6, 'STAGE_LIST', 'ด่านง่าย', '[]', 10);

INSERT INTO grade.evaluation_form_setting
(evaluation_form_indicator_id, evaluation_key, evaluation_topic, value, weight)
VALUES (7, 'STAGE_LIST', 'ด่านประเมินก่อนเรียน', '[1,2,8]', 10);
INSERT INTO grade.evaluation_form_setting
(evaluation_form_indicator_id, evaluation_key, evaluation_topic, value, weight)
VALUES (7, 'STAGE_LIST', 'ด่านง่าย', '[11]', 10);

INSERT INTO grade.evaluation_form_setting
(evaluation_form_indicator_id, evaluation_key, evaluation_topic, value, weight)
VALUES (8, 'STAGE_LIST', 'ด่านประเมินก่อนเรียน', '[1,7,8]', 10);
INSERT INTO grade.evaluation_form_setting
(evaluation_form_indicator_id, evaluation_key, evaluation_topic, value, weight)
VALUES (8, 'STAGE_LIST', 'ด่านง่าย', '[11]', 10);

INSERT INTO grade.evaluation_form_setting
(evaluation_form_indicator_id, evaluation_key, evaluation_topic, value, weight)
VALUES (9, 'STAGE_LIST', 'ด่านประเมินก่อนเรียน', '[1,7,8]', 10);
INSERT INTO grade.evaluation_form_setting
(evaluation_form_indicator_id, evaluation_key, evaluation_topic, value, weight)
VALUES (9, 'STAGE_LIST', 'ด่านง่าย', '[11]', 10);


INSERT INTO grade.evaluation_form_general_evaluation ( form_id, template_type, template_name)
VALUES (5, 'คุณลักษณะอันพึงประสงค์', 'คุณลักษณะอันพึงประสงค์ ประถม');
INSERT INTO grade.evaluation_form_general_evaluation
(form_id, template_type, template_name, additional_data)
VALUES(5, 'เวลาเรียน', 'เวลาเรียนประถม','{"hours": 200,"start_date": "2024-12-23","end_date": "2024-12-23"}');
INSERT INTO grade.evaluation_form_general_evaluation
(form_id, template_type, template_name)
VALUES(5, 'สมรรถนะ', 'สมรรถนะ ประถม');
INSERT INTO grade.evaluation_form_general_evaluation
(form_id, template_type, template_name)
VALUES(5, 'กิจกรรมพัฒนาผู้เรียน', 'กิจกรรมพัฒนาผู้เรียน ประถม');
INSERT INTO grade.evaluation_form_general_evaluation
(form_id, template_type, template_name)
VALUES(5, 'ภาวะโภชนาการ', 'ภาวะโภชนาการ ประถม');

INSERT INTO grade.evaluation_student ( form_id, citizen_no, student_id, title, thai_first_name,
                                       thai_last_name, eng_first_name, eng_last_name, birth_date, nationality, religion, parent_marital_status)
VALUES (5,'1234567890123','17340','Mr.','สมชาย','รักเรียน','Somchai',
        'Rukrian','2005-01-01','Thai','Buddhism','married');

-- mock sheet and data entry
INSERT INTO grade.evaluation_student (
    form_id, citizen_no, student_id, title, thai_first_name,
    thai_last_name, eng_first_name, eng_last_name, birth_date, nationality,
    religion, parent_marital_status, gender, ethnicity, father_title,
    father_first_name, father_last_name, mother_title, mother_first_name,
    mother_last_name, guardian_relation, guardian_title, guardian_first_name,
    guardian_last_name, address_no, address_moo, address_sub_district,
    address_district, address_province, address_postal_code
)
VALUES (
           5, '1234567890124', '17342', 'เด็กชาย', 'สมปอง', 'รักเรียน', 'Sompong',
           'Rukrian', '2005-01-01', 'Thai', 'Buddhism', 'married', 'ช', 'Thai',
           'Mr.', 'สมพงษ์', 'รักเรียน', 'Mrs.', 'สมศรี', 'รักเรียน', 'Father',
           'Mr.', 'สมพงษ์', 'รักเรียน', '99/1', '5', 'ตำบลทดสอบ', 'อำเภอทดสอบ',
           'จังหวัดทดสอบ', '10110'
       );

INSERT INTO grade.evaluation_student (
    form_id, citizen_no, student_id, title, thai_first_name,
    thai_last_name, eng_first_name, eng_last_name, birth_date, nationality,
    religion, parent_marital_status, gender, ethnicity, father_title,
    father_first_name, father_last_name, mother_title, mother_first_name,
    mother_last_name, guardian_relation, guardian_title, guardian_first_name,
    guardian_last_name, address_no, address_moo, address_sub_district,
    address_district, address_province, address_postal_code
)
VALUES (
           5, '1234567890125', '17343', 'เด็กหญิง', 'สมหญิง', 'รักเรียน', 'Somying',
           'Rukrian', '2005-01-01', 'Thai', 'Buddhism', 'married', 'ญ', 'Thai',
           'Mr.', 'สมพงษ์', 'รักเรียน', 'Mrs.', 'สมศรี', 'รักเรียน', 'มารดา',
           'Mrs.', 'สมศรี', 'รักเรียน', '99/1', '5', 'ตำบลทดสอบ', 'อำเภอทดสอบ',
           'จังหวัดทดสอบ', '10110'
       );


INSERT INTO grade.evaluation_sheet ( form_id, value_type, evaluation_form_subject_id,
                                     evaluation_form_general_evaluation_id, is_lock, status, created_at, created_by,
                                     updated_at, updated_by, admin_login_as)
VALUES ( 5, 0, 3, null, false, 'sent', '2025-01-24 17:41:52.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac',
         '2025-01-24 17:41:50.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac', null);

INSERT INTO grade.evaluation_data_entry ( sheet_id, version, json_student_score_data, status, is_lock, created_at,
                                          created_by, updated_at, updated_by)
VALUES (3, '1', '[{
    "evaluation_student_id": 2,
    "student_indicator_data": [
        {
            "indicator_id": 1,
            "indicator_general_name": null,
            "value": 10
        }
    ],
    "additional_fields": {
        "grade": "4",
        "total_score": 89
    }
},{
    "evaluation_student_id": 3,
    "student_indicator_data": [
        {
            "indicator_id": 1,
            "indicator_general_name": null,
            "value": 10
        }
    ],
    "additional_fields": {
        "grade": "2.5",
        "total_score": 66
    }
},{
    "evaluation_student_id": 4,
    "student_indicator_data": [
        {
            "indicator_id": 1,
            "indicator_general_name": null,
            "value": 10
        }
    ],
    "additional_fields": {
        "grade": "2.5",
        "total_score": 65
    }
}]', 'draft', false, '2025-01-24 17:44:35.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac',
        '2025-01-24 17:44:42.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac');
UPDATE grade.evaluation_sheet
SET current_data_entry_id = 2
WHERE id = 3;

INSERT INTO grade.evaluation_sheet ( form_id, value_type, evaluation_form_subject_id,
                                     evaluation_form_general_evaluation_id, is_lock, status, created_at, created_by,
                                     updated_at, updated_by, admin_login_as, current_data_entry_id)
VALUES ( 5, 1, null, 5, false, 'sent', '2025-01-24 17:41:52.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac',
         '2025-01-24 17:41:50.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac', null, null);

INSERT INTO grade.evaluation_sheet ( form_id, value_type, evaluation_form_subject_id,
                                     evaluation_form_general_evaluation_id, is_lock, status, created_at, created_by,
                                     updated_at, updated_by, admin_login_as, current_data_entry_id)
VALUES ( 5, 1, null, 6, false, 'sent', '2025-01-24 17:41:52.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac',
         '2025-01-24 17:41:50.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac', null, null);

INSERT INTO grade.evaluation_sheet ( form_id, value_type, evaluation_form_subject_id,
                                     evaluation_form_general_evaluation_id, is_lock, status, created_at, created_by,
                                     updated_at, updated_by, admin_login_as, current_data_entry_id)
VALUES ( 5, 1, null, 7, false, 'sent', '2025-01-24 17:41:52.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac',
         '2025-01-24 17:41:50.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac', null, null);

INSERT INTO grade.evaluation_sheet ( form_id, value_type, evaluation_form_subject_id,
                                     evaluation_form_general_evaluation_id, is_lock, status, created_at, created_by,
                                     updated_at, updated_by, admin_login_as, current_data_entry_id)
VALUES ( 5, 1, null, 8, false, 'sent', '2025-01-24 17:41:52.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac',
         '2025-01-24 17:41:50.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac', null, null);

INSERT INTO grade.evaluation_sheet ( form_id, value_type, evaluation_form_subject_id,
                                     evaluation_form_general_evaluation_id, is_lock, status, created_at, created_by,
                                     updated_at, updated_by, admin_login_as, current_data_entry_id)
VALUES ( 5, 1, null, 9, false, 'sent', '2025-01-24 17:41:52.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac',
         '2025-01-24 17:41:50.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac', null, null);

--คุณลักษณะอันพึงประสงค์
INSERT INTO grade.evaluation_data_entry ( sheet_id, version, json_student_score_data, status, is_lock, created_at,
                                          created_by, updated_at, updated_by)
VALUES (4, '1', '[{"evaluation_student_id":2,"student_indicator_data":[{"indicator_id":null,"indicator_general_name":"รักชาติ","value":0},{"indicator_id":null,"indicator_general_name":"ซื่อสัตย์","value":3},{"indicator_id":null,"indicator_general_name":"มีวินัย","value":0},{"indicator_id":null,"indicator_general_name":"ใฝ่เรียนรู้","value":0},{"indicator_id":null,"indicator_general_name":"พอเพียง","value":0},{"indicator_id":null,"indicator_general_name":"มุ่งมั่น","value":0},{"indicator_id":null,"indicator_general_name":"เป็นไทย","value":10},{"indicator_id":null,"indicator_general_name":"สาธารณะ","value":0},{"indicator_id":null,"indicator_general_name":"ผลประเมินคุณลักษณะอันพึงประสงค์","value":3},{"indicator_id":null,"indicator_general_name":"อ่าน คิดวิเคราะห์ และเขียนสื่อความ","value":1},{"indicator_id":null,"indicator_general_name":"ผลประเมินอ่าน คิดวิเคราะห์ และเขียนสื่อความ","value":4}]},{"evaluation_student_id":3,"student_indicator_data":[{"indicator_id":null,"indicator_general_name":"รักชาติ","value":0},{"indicator_id":null,"indicator_general_name":"ซื่อสัตย์","value":0},{"indicator_id":null,"indicator_general_name":"มีวินัย","value":0},{"indicator_id":null,"indicator_general_name":"ใฝ่เรียนรู้","value":0},{"indicator_id":null,"indicator_general_name":"พอเพียง","value":0},{"indicator_id":null,"indicator_general_name":"มุ่งมั่น","value":0},{"indicator_id":null,"indicator_general_name":"เป็นไทย","value":1},{"indicator_id":null,"indicator_general_name":"สาธารณะ","value":0},{"indicator_id":null,"indicator_general_name":"ผลประเมินคุณลักษณะอันพึงประสงค์","value":4},{"indicator_id":null,"indicator_general_name":"อ่าน คิดวิเคราะห์ และเขียนสื่อความ","value":4},{"indicator_id":null,"indicator_general_name":"ผลประเมินอ่าน คิดวิเคราะห์ และเขียนสื่อความ","value":0}]},{"evaluation_student_id":4,"student_indicator_data":[{"indicator_id":null,"indicator_general_name":"รักชาติ","value":0},{"indicator_id":null,"indicator_general_name":"ซื่อสัตย์","value":0},{"indicator_id":null,"indicator_general_name":"มีวินัย","value":0},{"indicator_id":null,"indicator_general_name":"ใฝ่เรียนรู้","value":2},{"indicator_id":null,"indicator_general_name":"พอเพียง","value":0},{"indicator_id":null,"indicator_general_name":"มุ่งมั่น","value":0},{"indicator_id":null,"indicator_general_name":"เป็นไทย","value":0},{"indicator_id":null,"indicator_general_name":"สาธารณะ","value":0},{"indicator_id":null,"indicator_general_name":"ผลประเมินคุณลักษณะอันพึงประสงค์","value":3},{"indicator_id":null,"indicator_general_name":"อ่าน คิดวิเคราะห์ และเขียนสื่อความ","value":2},{"indicator_id":null,"indicator_general_name":"ผลประเมินอ่าน คิดวิเคราะห์ และเขียนสื่อความ","value":1}]}]',
        'draft', false, '2025-01-24 17:44:35.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac',
        '2025-01-24 17:44:42.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac');
UPDATE grade.evaluation_sheet
SET current_data_entry_id = 3
WHERE id = 4;

--เวลาเรียน
INSERT INTO grade.evaluation_data_entry ( sheet_id, version, json_student_score_data, status, is_lock, created_at, created_by, updated_at, updated_by)
VALUES (5, '1', '[]', 'draft', false, '2025-01-24 17:44:35.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac', '2025-01-24 17:44:42.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac');
UPDATE grade.evaluation_sheet SET current_data_entry_id = 4 WHERE id = 5;

--สมรรถนะ
INSERT INTO grade.evaluation_data_entry ( sheet_id, version, json_student_score_data, status, is_lock, created_at, created_by, updated_at, updated_by)
VALUES (6, '1', '[{"evaluation_student_id":2,"student_indicator_data":[{"indicator_id":null,"indicator_general_name":"สมรรถนะสำคัญของผู้เรียน","value":3},{"indicator_id":null,"indicator_general_name":"ผลการประเมินสมรรถนะสำคัญของผู้เรียน","value":0}]},{"evaluation_student_id":3,"student_indicator_data":[{"indicator_id":null,"indicator_general_name":"สมรรถนะสำคัญของผู้เรียน","value":4},{"indicator_id":null,"indicator_general_name":"ผลการประเมินสมรรถนะสำคัญของผู้เรียน","value":1}]},{"evaluation_student_id":4,"student_indicator_data":[{"indicator_id":null,"indicator_general_name":"สมรรถนะสำคัญของผู้เรียน","value":0},{"indicator_id":null,"indicator_general_name":"ผลการประเมินสมรรถนะสำคัญของผู้เรียน","value":1}]}]',
        'draft', false, '2025-01-24 17:44:35.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac', '2025-01-24 17:44:42.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac');
UPDATE grade.evaluation_sheet SET current_data_entry_id = 5 WHERE id = 6;

--กิจกรรมพัฒนาผู้เรียน
INSERT INTO grade.evaluation_data_entry ( sheet_id, version, json_student_score_data, status, is_lock, created_at, created_by, updated_at, updated_by)
VALUES (7, '1', '[{"evaluation_student_id":2,"student_indicator_data":[{"indicator_id":null,"indicator_general_name":"แนะแนว","value":0},{"indicator_id":null,"indicator_general_name":"ลูกเสือ-เนตรนารี","value":2},{"indicator_id":null,"indicator_general_name":"ชุมนุม","value":2,"additional_fields":{"ชื่อชุมนุม":"ทดสอบ"}},{"indicator_id":null,"indicator_general_name":"กิจกรรมเพื่อสังคม และสาธารณประโยชน์","value":0}]},{"evaluation_student_id":3,"student_indicator_data":[{"indicator_id":null,"indicator_general_name":"แนะแนว","value":2},{"indicator_id":null,"indicator_general_name":"ลูกเสือ-เนตรนารี","value":0},{"indicator_id":null,"indicator_general_name":"ชุมนุม","value":0,"additional_fields":{"ชื่อชุมนุม":"ทดสอบ2"}},{"indicator_id":null,"indicator_general_name":"กิจกรรมเพื่อสังคม และสาธารณประโยชน์","value":0}]},{"evaluation_student_id":4,"student_indicator_data":[{"indicator_id":null,"indicator_general_name":"แนะแนว","value":1},{"indicator_id":null,"indicator_general_name":"ลูกเสือ-เนตรนารี","value":0},{"indicator_id":null,"indicator_general_name":"ชุมนุม","value":0,"additional_fields":{"ชื่อชุมนุม":"ทดสอบ1233"}},{"indicator_id":null,"indicator_general_name":"กิจกรรมเพื่อสังคม และสาธารณประโยชน์","value":1}]}]',
        'draft', false, '2025-01-24 17:44:35.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac', '2025-01-24 17:44:42.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac');
UPDATE grade.evaluation_sheet SET current_data_entry_id = 6 WHERE id = 7;

--ภาวะโภชนาการ
INSERT INTO grade.evaluation_data_entry ( sheet_id, version, json_student_score_data, status, is_lock, created_at, created_by, updated_at, updated_by)
VALUES (8, '1', '[]', 'draft', false, '2025-01-24 17:44:35.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac', '2025-01-24 17:44:42.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac');
UPDATE grade.evaluation_sheet SET current_data_entry_id = 7 WHERE id = 8;

-- add teacher
INSERT INTO grade.evaluation_form_additional_person
(form_id, value_type, value_id, user_type, user_id)
VALUES(5, 'SUBJECT', 1, 'teacher', '21ceee5d-ee10-462b-a1e3-659a2187ca95');
INSERT INTO grade.evaluation_form_additional_person
(form_id, value_type, value_id, user_type, user_id)
VALUES(5, 'SUBJECT', 1, 'teacher_advisor', '00f1b13e-0e62-45d2-9718-099cd545b3ac');

-- add mock sheet
INSERT INTO grade.evaluation_sheet ( form_id, value_type, evaluation_form_subject_id,
                                     evaluation_form_general_evaluation_id, is_lock, status, created_at, created_by,
                                     updated_at, updated_by, admin_login_as)
VALUES ( 1, 1, null, 1, false, 'draft', '2025-01-24 17:41:52.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac',
         '2025-01-24 17:41:50.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac', null);

INSERT INTO grade.evaluation_sheet ( form_id, value_type, evaluation_form_subject_id,
                                     evaluation_form_general_evaluation_id, is_lock, status, created_at, created_by,
                                     updated_at, updated_by, admin_login_as)
VALUES ( 1, 1, null, 1, false, 'disabled', '2025-01-24 17:41:52.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac',
         '2025-01-24 17:41:50.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac', null);

INSERT INTO grade.evaluation_sheet ( form_id, value_type, evaluation_form_subject_id,
                                     evaluation_form_general_evaluation_id, is_lock, status, created_at, created_by,
                                     updated_at, updated_by, admin_login_as)
VALUES ( 1, 1, null, 1, false, 'sent', '2025-01-24 17:41:52.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac',
         '2025-01-24 17:41:50.000000', '00f1b13e-0e62-45d2-9718-099cd545b3ac', null);