package constant

import (
	"mime/multipart"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type SchoolCreateRequest struct {
	ImageUrl                *string `db:"image_url"`
	Name                    string  `db:"name" form:"name" validate:"required"`
	Address                 string  `db:"address" form:"address"`
	Region                  string  `db:"region" form:"region"`
	Province                string  `db:"province" form:"province"`
	District                string  `db:"district" form:"district"`
	SubDistrict             string  `db:"sub_district" form:"sub_district"`
	PostCode                string  `db:"post_code" form:"post_code"`
	Latitude                *string `db:"latitude" form:"latitude"`
	Longtitude              *string `db:"longtitude" form:"longtitude"`
	Director                *string `db:"director" form:"director"`
	DirectorPhone           *string `db:"director_phone_number" form:"director_phone_number"`
	DeputyDirector          *string `db:"deputy_director" form:"deputy_director"`
	DeputyDirectorPhone     *string `db:"deputy_director_phone" form:"deputy_director_phone"`
	Registrar               *string `db:"registrar" form:"registrar"`
	RegistrarPhone          *string `db:"registrar_phone_number" form:"registrar_phone_number"`
	AcademicAffairHead      *string `db:"academic_affair_head" form:"academic_affair_head"`
	AcademicAffairHeadPhone *string `db:"academic_affair_head_phone_number" form:"academic_affair_head_phone_number"`
	Advisor                 *string `db:"advisor" form:"advisor"`
	AdvisorPhone            *string `db:"advisor_phone_number" form:"advisor_phone_number"`
	Status                  string  `db:"status" form:"status"`
	CreatedBy               string  `db:"created_by"`
	Code                    *string `db:"code" form:"code"`
	SchoolAffiliationId     int     `db:"school_affiliation_id" form:"school_affiliation_id" validate:"required"`
}
type SchoolUpdateRequest struct {
	Id                      int     `db:"id"`
	ImageUrl                *string `db:"image_url"`
	Name                    string  `db:"name" form:"name" validate:"required"`
	Address                 string  `db:"address" form:"address"`
	Region                  string  `db:"region" form:"region"`
	Province                string  `db:"province" form:"province"`
	District                string  `db:"district" form:"district"`
	SubDistrict             string  `db:"sub_district" form:"sub_district"`
	PostCode                string  `db:"post_code" form:"post_code"`
	Latitude                *string `db:"latitude" form:"latitude"`
	Longtitude              *string `db:"longtitude" form:"longtitude"`
	Director                *string `db:"director" form:"director"`
	DirectorPhone           *string `db:"director_phone_number" form:"director_phone_number"`
	DeputyDirector          *string `db:"deputy_director" form:"deputy_director"`
	DeputyDirectorPhone     *string `db:"deputy_director" form:"deputy_director_phone"`
	Registrar               *string `db:"registrar" form:"registrar"`
	RegistrarPhone          *string `db:"registrar_phone_number" form:"registrar_phone_number"`
	AcademicAffairHead      *string `db:"academic_affair_head" form:"academic_affair_head"`
	AcademicAffairHeadPhone *string `db:"academic_affair_head_phone_number" form:"academic_affair_head_phone_number"`
	Advisor                 *string `db:"advisor" form:"advisor"`
	AdvisorPhone            *string `db:"advisor_phone_number" form:"advisor_phone_number"`
	Status                  string  `db:"status" form:"status"`
	UpdatedBy               string  `db:"updated_by"`
	Code                    *string `db:"code" form:"code"`
	SchoolAffiliationId     int     `db:"school_affiliation_id" form:"school_affiliation_id" validate:"required"`
}
type UpdatedSubjectRequest struct {
	SchoolId  int
	SubjectId int
	IsEnabled bool `db:"is_enabled" json:"is_enabled" validate:"required"`
}
type SchoolBulkEdit struct {
	Id     int    `db:"id" json:"id"`
	Status string `db:"status" json:"status"`
}
type SubjectBulkEdit struct {
	SubjectId int  `db:"subject_id" json:"subject_id"`
	IsEnabled bool `db:"is_enabled" json:"is_enabled"`
}
type ContactListRequest struct {
	SchoolId   int
	ContractId int
}

type ContactFilter struct {
	YearId            int    `query:"year_id"`
	CurriculumGroupId int    `query:"curriculum_group_id"`
	Status            string `query:"status"`
}
type SchoolListFilter struct {
	SchoolId              int    `query:"school_id"`
	SchoolName            string `query:"school_name"`
	Province              string `query:"province"`
	SchoolAffiliationId   int    `query:"school_affiliation_id"`
	SchoolAffiliationName string `query:"school_affiliation_name"`
	SearchText            string `query:"search_text"`
	Status                string `query:"status"`
}

type SchoolAffiliationFilter struct {
	SchoolAffiliationId    int    `query:"school_affiliation_id"`
	SchoolAffiliationGroup string `query:"school_affiliation_group"`
	SchoolAffiliationDoeId int    `query:"school_affiliation_doe_id"`
	Type                   string `query:"type"`
	Name                   string `query:"name"`
	ShortName              string `query:"short_name"`
}
type FilterSubject struct {
	CurriculumGroupId int    `query:"curriculum_group_id"`
	YearId            int    `query:"year_id"`
	Status            string `query:"status"`
	SearchText        string `query:"search_text"`
	SeedYearName      string `query:"seed_year_name"`
	Year              string `query:"year"`
}
type FilterSchoolContract struct {
	SearchText string `query:"search_text"`
}

type CsvDowloadRequest struct {
	StartDate string `query:"start_date"`
	EndDate   string `query:"end_date"`
}
type CSVUploadRequest struct {
	Csvfile    *multipart.FileHeader `form:"csv_file"`
	SubjectId  string
	Pagination *helper.Pagination
}

var SchoolCSVHeader = []string{"No", "รหัสโรงเรียน (ห้ามแก้)", "สังกัดโรงเรียน (บังคับ, ต้องมีในระบบ)", "ชื่อโรงเรียน (บังคับ, ห้ามซ้ำ)", "ที่อยู่ (บังคับ)", "ภาค (บังคับ)", "จังหวัด (บังคับ)", "อำเภอ (บังคับ)", "ตำบล (บังคับ)", "รหัสไปรษณีย์ (บังคับ)", "ละติจุูด", "ลองติจูด", "ผู้อำนวยการ", "เบอร์โทรศัพท์ผู้อำนวยการ", "นายทะเบียน", "เบอร์โทรศัพท์นายทะเบียน", "หัวหน้าวิชาการโรงเรียน", "เบอร์โทรศัพท์หัวหน้าวิชาการโรงเรียน", "ครูที่ปรึกษา", "เบอร์โทรศัพท์ครูที่ปรึกษา", "สถานะ (บังคับ, enabled = ใช้งาน, disabled = ไม่ใช้งาน, draft = แบบร่าง)", "รหัสย่อโรงเรียน (บังคับ, ห้ามซ้ำ)"}
