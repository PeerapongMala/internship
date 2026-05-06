//another schema
table user.user {
  note: "user"
  id char(36) [pk]
  email varchar [unique]
  title varchar [not null, note: "คำนำหน้า เช่น นาน / นางสาว"]
  first_name varchar [not null]
  last_name varchar [not null]
  id_number varchar [note: "เลขบัตรประชาชน"]
  image_url varchar 
  status varchar [not null]
  created_at timestamp [not null]
  created_by char(36)
  updated_at timestamp
  updated_by char(36) 
  last_login timestamp
}

//another schema
table school.school {
  note: "โรงเรียน"
  id int [pk, increment]
  image_url varchar
  name varchar [not null, note: "ชื่อโรงเรียน"]
  code varchar [unique, not null, note: "รหัสย่อโรงเรียน"]
  address varchar [not null, note: "ที่อยู่"]
  region varchar [not null, note: "ภาค"]
  province varchar [not null, note: "จังหวัด"]
  district varchar [not null, note:  "อำเภอ"]
  sub_district varchar [not null, note: "ตำบล"]
  post_code varchar [not null, note: "รหัสไปรษณีย์"]
  latitude varchar [note: "ละติจูด"]
  longtitude varchar [note: "ลองติจูด"]
  director varchar [note: "ผู้อำนวยการ"]
  director_phone_number varchar [note: "เบอร์ผู้อำนวยการ"]
  registrar varchar [note: "นายทะเบียน"]
  registrar_phone_number varchar [note: "เบอร์นายทะเบียน"]
  academic_affair_head varchar [note: "หัวหน้าฝ่ายวิชาการ"]
  academic_affair_head_phone_number varchar [note: "เบอร์หัวหน้าฝ่ายวิชาการ"]
  advisor varchar [note: "ครูที่ปรึกษา"]
  advisor_phone_number varchar [note: "เบอร์ครูที่ปรึกษา"]
  status varchar [not null]
  created_at timestamp [not null]
  created_by char(36) [not null, ref: > user.user.id]
  updated_at timestamp
  updated_by char(36) [ref: > user.user.id]
}


//Grade template 
table grade.template {
  note: "grade template (ใบตัดเกรด)"
  id int [pk, increment]
  school_id int [ref: > school.school.id]
  year varchar
  template_name varchar [not null]
  active_flag bool
  version varchar
  status varchar [not null]
  created_at timestamp [not null]
  created_by char(36) [not null, ref: > user.user.id]
  updated_at timestamp 
  updated_by char(36) [ref: > user.user.id]
  admin_login_as char(36) [ref: > user.user.id, note: "admin: ที่ทำแทน"]
}

//Grade template-2
table grade.template_subject {
  id int [pk, increment]
  template_id int [not null, ref: > grade.template.id]
  subject_name varchar [not null, note: "figma ชื่อวิชา"]
  is_clever bool [not null]
  clever_subject_id int
  clever_subject_name varchar
}

//Grade template-2.5
table grade.template_general_evaluation {
  id int [pk, increment]
  template_id int [not null, ref: > grade.template.id]
  template_type varchar [not null]
  template_name varchar [not null]
}

//Grade template-3
table grade.template_indicator {
  id int [pk, increment]
  template_subject_id int [not null, ref: > grade.template_subject.id]
  name varchar [not null]
  weight int
  sort int
  score_evaluation_type varchar
}

//Grade template-4 (การตั้งค่าการประเมิน)
table grade.template_assessment_setting {
  note: "การตั้งค่าการประเมิน"
  id int [pk, increment]
  template_indicator_id int [not null, ref: > grade.template_indicator.id]
  evaluation_key varchar
  evaluation_topic varchar
  value varchar
  weight int
}

//General template
table grade.general_template {
  note: "แบบประเมินทั่วไป"
  id int [pk, increment]
  school_id int [ref: > school.school.id]
  template_type varchar [not null]
  template_name varchar [not null]
  status varchar [not null]
  active_flag bool
  created_at timestamp [not null]
  created_by char(36) [not null, ref: > user.user.id]
  updated_at timestamp 
  updated_by char(36) [ref: > user.user.id]
  admin_login_as char(36) [ref: > user.user.id, note: "admin: ที่ทำแทน"]
}

//evaluation-form (ใบตัดเกรด)
table grade.evaluation_form {
  note: "ใบตัดเกรด"
  id int [pk, increment]
  school_id int [ref: > school.school.id]
  template_id int [not null, ref: > grade.template.id]
  academic_year varchar [not null]
  year varchar [not null]
  school_room varchar [not null, note: "ห้อง 1"]
  school_term varchar [not null, note: "1,2,SUMMER,รวมปี"]
  is_lock bool
  status varchar [not null]
  created_at timestamp [not null]
  created_by char(36) [not null, ref: > user.user.id]
  updated_at timestamp 
  updated_by char(36) [ref: > user.user.id]
  admin_login_as char(36) [ref: > user.user.id, note: "admin: ที่ทำแทน"]
}

//evaluation-form-2
table grade.evaluation_form_subject {
  note: "วิชา"
  id int [pk, increment]
  form_id int [not null, ref: > grade.evaluation_form.id]
  template_subject_id int [not null, ref: > grade.template_subject.id]
}

//evaluation-form-2.5
table grade.evaluation_form_general_evaluation {
  note: "การประเมินทั่วไป"
  id int [pk, increment]
  form_id int [not null, ref: > grade.evaluation_form.id]
  template_type varchar [not null]
  template_name varchar [not null]
}

//evaluation-form-3
table grade.evaluation_form_additional_person {
  id int [pk, increment]
  form_id int [not null, ref: > grade.evaluation_form.id]
  value_type varchar
  value_id varchar
  user_type varchar
  user_id varchar [not null, ref: > user.user.id]
}

//evaluation-form-4
table grade.evaluation_form_indicator {
  id int [pk, increment]
  evaluation_form_subject_id int [not null, ref: > grade.evaluation_form_subject.id]
  name varchar [not null]
  weight int
  sort int
  score_evaluation_type varchar
}

//evaluation-form-5
table grade.evaluation_form_setting {
  id int [pk, increment]
  evaluation_form_indicator_id int [not null, ref: > grade.evaluation_form_indicator.id]
  evaluation_key varchar
  evaluation_topic varchar
  value varchar
  weight int
}

//evaluation-form-6 (จด note ใน data entry)
table grade.evaluation_form_note {
  note: "note ใช้ใน G0603"
  id int [pk, increment]
  sheet_id int [not null, ref: > grade.evaluation_sheet.id]
  note_value text
  created_at timestamp [not null]
  created_by char(36) [not null, ref: > user.user.id]
  updated_at timestamp 
  updated_by char(36) [ref: > user.user.id]
}

//evaluation-form-6 (กรอกข้อมูลของครู)
table grade.evaluation_data_entry {
  note: "เก็บข้อมูลเป็น json ใช้ใน G0603"
  id int [pk, increment]
  sheet_id int [not null, ref: > grade.evaluation_sheet.id]
  version varchar [not null]
  json_student_score_data text [not null, note: "เก็บเป็น json ข้อมูลของนักเรียนพร้อมคะแนนทั้งหมด"]
  status varchar [not null]
  is_lock bool [note: "ใช้ใน 06.04"]
}

// mock porphor5
table grade.porphor5_data {
  note: "batch data มาเก็บ หลังจาก ใบเกรดเป็นออกรายงานแล้ว"
  id int [pk, increment]
  data_json text
  created_at timestamp [not null]
}

// mock porphor6
table grade.porphor6_data {
  note: "batch data มาเก็บ หลังจาก ใบเกรดเป็นออกรายงานแล้ว"
  id int [pk, increment]
  subject_name varchar
  student_id varchar
  data_json text
  created_at timestamp [not null]
}

table grade.evaluation_student {
  note: "รายชื่อนักเรียนเชื่อมต่อกับ evaluation_form"
  id int [pk, increment]
  form_id int [not null, ref: > grade.evaluation_form.id, note: "link for academic_year,year,room"]
  citizen_no varchar
  student_id varchar
  title varchar
  thai_first_name varchar
  thai_last_name varchar
  eng_first_name varchar
  eng_last_name varchar
  birth_date varchar
  nationality varchar
  religion varchar
  parent_marital_status varchar
}

table grade.evaluation_sheet {
  note: "ใบประเมิน ลิ้งกับ evaluation_subject, evaluation_evaluation"
  id int [pk, increment]
  form_id int [not null, ref: > grade.evaluation_form.id]
  value_type int
  evaluation_form_subject_id int [ref: > grade.evaluation_form_subject.id]
  evaluation_form_general_evaluation_id int [ref: > grade.evaluation_form_general_evaluation.id]
  is_lock bool
  status varchar [not null]
  created_at timestamp [not null]
  created_by char(36) [not null, ref: > user.user.id]
  updated_at timestamp 
  updated_by char(36) [ref: > user.user.id]
  admin_login_as char(36) [ref: > user.user.id, note: "admin: ที่ทำแทน"]
}