-- +goose Up
-- +goose StatementBegin
alter table grade.evaluation_student
    add constraint evaluation_student_pk
        unique (form_id, citizen_no);

alter table grade.evaluation_student
-- ข้อมูลนักเรียน
    add column gender varchar,    -- "เพศ"
    add column ethnicity varchar,    -- "เชื้อชาติ"
-- ข้อมูลบิดา
    add column father_title varchar,    -- "คำนำหน้าชื่อบิดา"
    add column father_first_name varchar,    -- "ชื่อบิดา"
    add column father_last_name varchar,    -- "นามสกุลบิดา"
-- ข้อมูลมารดา
    add column mother_title varchar,    -- "คำนำหน้าชื่อมารดา"
    add column mother_first_name varchar,    -- "ชื่อมารดา"
    add column mother_last_name varchar,    -- "นามสกุลมารดา"
-- ข้อมูลผู้ปกครอง
    add column guardian_relation varchar,    -- "ความเกี่ยวข้องของผู้ปกครองกับนักเรียน"
    add column guardian_title varchar,    -- "คำนำหน้าชื่อผู้ปกครอง"
    add column guardian_first_name varchar,    -- "ชื่อผู้ปกครอง"
    add column guardian_last_name varchar,    -- "นามสกุลผู้ปกครอง"
-- ที่อยู่ตามทะเบียนบ้าน
    add column address_no varchar,    -- "เลขที่บ้าน (ทะเบียนบ้าน)"
    add column address_moo varchar,    -- "หมู่ (ทะเบียนบ้าน)"
    add column address_sub_district varchar,    -- "ตำบล (ทะเบียนบ้าน)"
    add column address_district varchar,    -- "อำเภอ (ทะเบียนบ้าน)"
    add column address_province varchar,    -- "จังหวัด (ทะเบียนบ้าน)"
    add column address_postal_code varchar;    -- "รหัสไปรษณีย์ (ทะเบียนบ้าน)"

-- เพิ่ม Comment อธิบาย Field
comment on column grade.evaluation_student.gender is 'เพศ';
comment on column grade.evaluation_student.ethnicity is 'เชื้อชาติ';
comment on column grade.evaluation_student.father_title is 'คำนำหน้าชื่อบิดา';
comment on column grade.evaluation_student.father_first_name is 'ชื่อบิดา';
comment on column grade.evaluation_student.father_last_name is 'นามสกุลบิดา';
comment on column grade.evaluation_student.mother_title is 'คำนำหน้าชื่อมารดา';
comment on column grade.evaluation_student.mother_first_name is 'ชื่อมารดา';
comment on column grade.evaluation_student.mother_last_name is 'นามสกุลมารดา';
comment on column grade.evaluation_student.guardian_relation is 'ความเกี่ยวข้องของผู้ปกครองกับนักเรียน';
comment on column grade.evaluation_student.guardian_title is 'คำนำหน้าชื่อผู้ปกครอง';
comment on column grade.evaluation_student.guardian_first_name is 'ชื่อผู้ปกครอง';
comment on column grade.evaluation_student.guardian_last_name is 'นามสกุลผู้ปกครอง';
comment on column grade.evaluation_student.address_no is 'เลขที่บ้าน (ทะเบียนบ้าน)';
comment on column grade.evaluation_student.address_moo is 'หมู่ (ทะเบียนบ้าน)';
comment on column grade.evaluation_student.address_sub_district is 'ตำบล (ทะเบียนบ้าน)';
comment on column grade.evaluation_student.address_district is 'อำเภอ (ทะเบียนบ้าน)';
comment on column grade.evaluation_student.address_province is 'จังหวัด (ทะเบียนบ้าน)';
comment on column grade.evaluation_student.address_postal_code is 'รหัสไปรษณีย์ (ทะเบียนบ้าน)';

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
drop index grade.evaluation_student_pk;
-- +goose StatementEnd
