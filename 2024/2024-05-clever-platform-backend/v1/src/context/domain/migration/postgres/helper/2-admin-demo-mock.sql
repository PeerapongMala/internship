BEGIN
TRANSACTION;

INSERT
    INTO
    school.school
    (
        id,
        image_url,
        name,
        address,
        region,
        province,
        district,
        sub_district,
        post_code,
        latitude,
        longtitude,
        director,
        director_phone_number,
        registrar,
        registrar_phone_number,
        academic_affair_head,
        academic_affair_head_phone_number,
        advisor,
        advisor_phone_number,
        status,
        created_at,
        created_by,
        code
    )
VALUES
    (
        1,
        'https://www.example.com/dummy-url',
        'โรงเรียนสาธิตมัธยม',
        'ถนนพัฒนาการ แขวงทวีวัฒนา เขตทวีวัฒนา กรุงเทพฯ 10170',
        'ภาคกลาง',
        'กรุงเทพมหานคร',
        'บางแค',
        'บางมด',
        '10150',
        '100.5018',
        '100.5018',
        'สมชาย กาญจนาคำ',
        '012-345-6789',
        'ธนา พัฒนกุล',
        '012-345-6789',
        'นิตยา อภิชาติเชื้อ',
        '012-345-6789',
        'วีระพงษ์ ศรีสมบัติ',
        '012-345-6789',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10',
        'C-123'
    );

INSERT
    INTO
    school_affiliation.school_affiliation
    (
        id,
        school_affiliation_group,
        "type",
        "name",
        short_name,
        status,
        created_at,
        created_by
    )
VALUES
    (
        1,
        'อื่นๆ',
        'เอกชน',
        'สำนักงานเขตการศึกษาเขต 1',
        'กก',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'
    );

INSERT
    INTO
    school_affiliation.contract
    (
        id,
        school_affiliation_id,
        seed_platform_id,
        seed_project_id,
        name,
        start_date,
        end_date,
        status,
        created_at,
        created_by,
        wizard_index
    )
VALUES
    (
        1,
        1,
        1,
        1,
        ' สัญญา 2567',
        '2024-11-18T17:25:19.821779Z',
        '2024-11-20T17:25:19.821779Z',
        'enabled',
        '2024-11-18T17:25:19.821779Z',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10',
        5
    );

INSERT
    INTO
    school_affiliation.school_affiliation_school
    (
        school_affiliation_id,
        school_id
    )
VALUES(
          1,
          1
      );

INSERT
    INTO
    school_affiliation.contract_school
    (
        contract_id,
        school_id
    )
VALUES(
          1,
          1
      );

INSERT
    INTO
    school_affiliation.contract_subject_group
    (
        contract_id,
        subject_group_id,
        is_enabled
    )
VALUES(
          1,
          1,
          TRUE
      );

INSERT
    INTO
    "user"."user"
    (
        id,
        email,
        title,
        first_name,
        last_name,
        id_number,
        image_url,
        status,
        created_at,
        created_by
    )
VALUES(
          '21ceee5d-ee10-462b-a1e3-659a2187ca95',
          'parent@parent.com',
          'ครู',
          'นิต',
          'ยา',
          '330234993243',
          'https://example.com/dummy.png',
          'enabled',
          '2024-11-18T17:25:19.821779Z',
          '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'
      );

INSERT
    INTO
    "user".user_role
    (
        user_id,
        role_id
    )
VALUES(
          '21ceee5d-ee10-462b-a1e3-659a2187ca95',
          8
      );

INSERT
    INTO
    "user"."user"
    (
        id,
        email,
        title,
        first_name,
        last_name,
        id_number,
        image_url,
        status,
        created_at,
        created_by
    )
VALUES(
          '00f1b13e-0e62-45d2-9718-099cd545b3ac',
          'teacher@teacher.com',
          'ครู',
          'เชื้อ',
          'อภิชาติ',
          '220234993243',
          'https://example.com/dummy.png',
          'enabled',
          '2024-11-18T17:25:19.821779Z',
          '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'
      );

INSERT
    INTO
    "user".user_role
    (
        user_id,
        role_id
    )
VALUES(
          '00f1b13e-0e62-45d2-9718-099cd545b3ac',
          6
      );

INSERT
    INTO
    "user".user_teacher_access
    (
        user_id,
        teacher_access_id
    )
VALUES(
          '00f1b13e-0e62-45d2-9718-099cd545b3ac',
          1
      ),
      (
          '00f1b13e-0e62-45d2-9718-099cd545b3ac',
          2
      );

INSERT
    INTO
    "class"."class"
    (
        id,
        school_id,
        academic_year,
        "year",
        "name",
        status,
        created_at,
        created_by
    )
VALUES(
          1,
          1,
          2567,
          'ป.4',
          '1',
          'enabled',
          '2024-11-18T17:25:19.821779Z',
          '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'
      );

INSERT
    INTO
    subject.subject_teacher
    (
        id,
        subject_id,
        teacher_id,
        academic_year
    )
VALUES(
          1,
          1,
          '00f1b13e-0e62-45d2-9718-099cd545b3ac',
          2567
      );

INSERT
    INTO
    school.class_teacher
    (
        class_id,
        teacher_id
    )
VALUES(
          1,
          '00f1b13e-0e62-45d2-9718-099cd545b3ac'
      );

INSERT
    INTO
    "user"."user"
    (
        id,
        email,
        title,
        first_name,
        last_name,
        id_number,
        image_url,
        status,
        created_at,
        created_by
    )
VALUES(
          'cd1592be-7302-4805-a172-86956b0bf2a1',
          'student@student.com',
          'เด็กชาย',
          'อภิชาติ',
          'เชื้อ',
          '110234993243',
          'https://example.com/dummy.png',
          'enabled',
          '2024-11-18T17:25:19.821779Z',
          '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'
      );

INSERT
    INTO
    "user".student
    (
        user_id,
        school_id,
        student_id,
        "year",
        birth_date,
        nationality,
        ethnicity,
        religion,
        father_title,
        father_first_name,
        father_last_name,
        mother_title,
        mother_first_name,
        mother_last_name,
        house_number,
        moo,
        district,
        sub_district,
        province,
        post_code,
        parent_marital_status
    )
VALUES(
          'cd1592be-7302-4805-a172-86956b0bf2a1',
          1,
          '17340',
          'ป.4',
          '2024-11-18T17:25:19.821779Z',
          'ไทย',
          'ไทย',
          'พุทธ',
          'นาย',
          'ธนา',
          'พัฒนกุล',
          'นาง',
          'นิตยา',
          'อภิชาติเชื้อ',
          '123/132',
          '1',
          'บางแค',
          'บางมด',
          'กรุงเทพมหานคร',
          '10150',
          'อย่าร้าง'
      );

INSERT
INTO
    "user".user_role
(
    user_id,
    role_id
)
VALUES(
          'cd1592be-7302-4805-a172-86956b0bf2a1',
          7
      );

INSERT
    INTO
    auth.auth_oauth
    (
        provider,
        user_id,
        subject_id
    )
VALUES(
          'line',
          'cd1592be-7302-4805-a172-86956b0bf2a1',
          'dummy line subject id'
      );

INSERT
    INTO
    auth.auth_pin
    (
        user_id,
        pin
    )
VALUES(
          'cd1592be-7302-4805-a172-86956b0bf2a1',
          '1234'
      );

INSERT
    INTO
    school.class_student
    (
        class_id,
        student_id
    )
VALUES(
          1,
          'cd1592be-7302-4805-a172-86956b0bf2a1'
      );
--INSERT
--	INTO
--	"level".level_play_log
--(
--		id,
--		student_id,
--		level_id,
--		played_at,
--		star,
--		time_used,
--		class_id
--	)
--VALUES(
--	1,
--	'cd1592be-7302-4805-a172-86956b0bf2a1',
--	1,
--	'2024-11-18T17:25:19.821779Z',
--	3,
--	111,
--	1
--);
--
--INSERT
--	INTO
--	question.question_play_log
--(
--		id,
--		level_play_log_id,
--		question_id,
--		is_correct,
--		time_used
--	)
--VALUES(
--	1,
--	1,
--	1,
--	TRUE,
--	50
--),
--(
--	2,
--	1,
--	2,
--	TRUE,
--	61
--);
--INSERT
--	INTO
--	"level".teacher_note
--(
--		teacher_id,
--		student_id,
--		level_id,
--		"text",
--		academic_year,
--		created_at,
--		created_by
--	)
--VALUES(
--	'00f1b13e-0e62-45d2-9718-099cd545b3ac',
--	'cd1592be-7302-4805-a172-86956b0bf2a1',
--	1,
--	'lorem ipsum',
--	2567,
--	'2024-11-18T17:25:19.821779Z',
--	'1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'
--);

INSERT
    INTO
    "family"."family"
    (
        id,
        created_at,
        created_by
    )
VALUES(
          1,
          '2024-11-18T17:25:19.821779Z',
          '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'
      );

INSERT
    INTO
    "family".family_member
    (
        family_id,
        user_id,
        is_owner
    )
VALUES(
          1,
          'cd1592be-7302-4805-a172-86956b0bf2a1',
          FALSE
      ),
      (
          1,
          '21ceee5d-ee10-462b-a1e3-659a2187ca95',
          TRUE
      )
;

INSERT
    INTO
    "user"."user"
    (
        id,
        email,
        title,
        first_name,
        last_name,
        id_number,
        image_url,
        status,
        created_at,
        created_by
    )
VALUES(
          '31ceee5d-ee10-462b-a1e3-659a2187ca95',
          'observer@observer.com',
          'นาย',
          'ยา',
          'นิต',
          '440234993243',
          'https://example.com/dummy.png',
          'enabled',
          '2024-11-18T17:25:19.821779Z',
          '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'
      );

INSERT
    INTO
    "user".user_role
    (
        user_id,
        role_id
    )
VALUES(
          '31ceee5d-ee10-462b-a1e3-659a2187ca95',
          4
      );

INSERT
    INTO
    auth.observer_access
    (
        id,
        access_name,
        "name",
        district_group,
        status,
        created_at,
        created_by
    )
VALUES(
          1,
          'ผู้บริหารเขต',
          'ผู้บริหารเขตพื้นที่ 1',
          'กรุงเทพกลาง',
          'enabled',
          '2024-11-18T17:25:19.821779Z',
          '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'
      );

INSERT
    INTO
    auth.observer_access
    (
        id,
        access_name,
        "name",
        status,
        created_at,
        created_by
    )
VALUES(
          2,
          'ผู้บริหารโรงเรียน',
          'ผู้บริหารโรงเรียนสาธิตมัธยม',
          'enabled',
          '2024-11-18T17:25:19.821779Z',
          '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'
      );

INSERT
    INTO
    auth.observer_access_school
    (
        observer_access_id,
        school_id
    )
VALUES(
          2,
          1
      );

INSERT
    INTO
    "user".user_observer_access
    (
        user_id,
        observer_access_id
    )
VALUES(
          '31ceee5d-ee10-462b-a1e3-659a2187ca95',
          2
      );

INSERT
    INTO
    school.school_observer
    (
        school_id,
        user_id
    )
VALUES(
          1,
          '31ceee5d-ee10-462b-a1e3-659a2187ca95'
      );

INSERT
    INTO
    "user"."user"
    (
        id,
        email,
        title,
        first_name,
        last_name,
        id_number,
        image_url,
        status,
        created_at,
        created_by
    )
VALUES(
          '45a47203-9d83-4e4f-b7b8-6eb748b2eed8',
          'announcer@announcer.com',
          'นาย',
          'วอท',
          'เดอะ',
          '550234993243',
          'https://example.com/dummy.png',
          'enabled',
          '2024-11-18T17:25:19.821779Z',
          '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'
      );

INSERT
    INTO
    "user".user_role
    (
        user_id,
        role_id
    )
VALUES(
          '45a47203-9d83-4e4f-b7b8-6eb748b2eed8',
          5
      );

INSERT
    INTO
    "school"."school_announcer"
    (
     school_id,
     user_id
    )
VALUES(
          1,
          '45a47203-9d83-4e4f-b7b8-6eb748b2eed8'
    );


INSERT
    INTO
    "level"."level"
    (
        sub_lesson_id,
        "index",
        question_type,
        level_type,
        difficulty,
        lock_next_level,
        timer_type,
        timer_time,
        bloom_type,
        status,
        created_at,
        created_by,
        wizard_index
    )
VALUES(
          1,
          1,
          'multiple-choices',
          'test',
          'easy',
          FALSE,
          'warn',
          30,
          1,
          'disabled',
          '2024-11-18T17:25:19.821779Z',
          '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10',
          5
      );

-- INSERT
--     INTO
--     question.question
--     (
--         id,
--         level_id,
--         "index",
--         question_type,
--         timer_type,
--         choice_position,
--         layout,
--         left_box_columns,
--         left_box_rows,
--         bottom_box_columns,
--         bottom_box_rows,
--         enforce_description_language,
--         enforce_choice_language,
--         timer_time
--     )
-- VALUES(
--           1,
--           1,
--           1,
--           'multiple-choices',
--           'warn',
--           'left',
--           '1:1',
--           '2',
--           'auto',
--           '2',
--           'auto',
--           FALSE,
--           FALSE,
--           0
--       ),
--       (
--           2,
--           1,
--           2,
--           'multiple-choices',
--           'warn',
--           'left',
--           '1:1',
--           '2',
--           'auto',
--           '2',
--           'auto',
--           FALSE,
--           FALSE,
--           0
--       );
--
-- INSERT
--     INTO
--     "level".level_play_log
--     (
--         id,
--         student_id,
--         level_id,
--         played_at,
--         star,
--         time_used,
--         class_id
--     )
-- VALUES(
--           1,
--           'cd1592be-7302-4805-a172-86956b0bf2a1',
--           1,
--           '2024-11-18T17:25:19.821779Z',
--           3,
--           111,
--           1
--       );
--
-- INSERT
--     INTO
--     question.question_play_log
--     (
--         id,
--         level_play_log_id,
--         question_id,
--         is_correct,
--         time_used
--     )
-- VALUES(
--           1,
--           1,
--           1,
--           TRUE,
--           50
--       ),
--       (
--           2,
--           1,
--           2,
--           TRUE,
--           61
--       );


INSERT
    INTO
    "level".teacher_note
    (
        teacher_id,
        student_id,
        level_id,
        "text",
        academic_year,
        created_at,
        created_by
    )
VALUES(
          '00f1b13e-0e62-45d2-9718-099cd545b3ac',
          'cd1592be-7302-4805-a172-86956b0bf2a1',
          1,
          'lorem ipsum',
          2567,
          '2024-11-18T17:25:19.821779Z',
          '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'
      );

INSERT INTO school.school_subject (contract_id,school_id,subject_id,is_enabled) VALUES
    (1,1,1,true);

INSERT INTO school.school_lesson (school_id,lesson_id,class_id,is_enabled) VALUES
    (1,1,1,true);

INSERT INTO school.school_sub_lesson (school_id,sub_lesson_id,class_id,is_enabled) VALUES
    (1,1,1,true);

COMMIT;