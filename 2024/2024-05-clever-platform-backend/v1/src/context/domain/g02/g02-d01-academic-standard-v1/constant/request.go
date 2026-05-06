package constant

import "mime/multipart"

type LearningAreaCreateRequest struct {
	CurriculumGroupId int    `db:"curriculum_group_id" json:"curriculum_group_id"`
	YearId            int    `db:"year_id" json:"year_id"`
	LearningAreaName  string `db:"name" json:"name"`
	Status            string `db:"status" json:"status"`
	CreatedBy         string `db:"created_by"`
	SubjectId         string
	Roles             []int
}

type LearningAreaUpdateRequest struct {
	Id                int    `db:"id"`
	CurriculumGroupId int    `db:"curriculum_group_id" json:"curriculum_group_id"`
	YearId            int    `db:"year_id" json:"year_id"`
	LearningAreaName  string `db:"name" json:"name"`
	Status            string `db:"status" json:"status"`
	UpdatedBy         string `db:"updated_by"`
	SubjectId         string
	Roles             []int
}

// /////////////////////////////////////////////////////////
type ContentCreateRequest struct {
	LearningAreaId int    `db:"learning_area_id" json:"learning_area_id"`
	Name           string `db:"name" json:"name"`
	Status         string `db:"status" json:"status"`
	CreatedBy      string `db:"created_by"`
	SubjectId      string
	Roles          []int
}

type ContentUpdateRequest struct {
	Id             int    `db:"id"`
	LearningAreaId int    `db:"learning_area_id" json:"learning_area_id"`
	Name           string `db:"name" json:"name"`
	Status         string `db:"status" json:"status"`
	UpdatedBy      string `db:"updated_by"`
	SubjectId      string
	Roles          []int
}

///////////////////////////////////////////////////////////

type CriteriaCreateRequest struct {
	ContentId int    `db:"content_id" json:"content_id"`
	Name      string `db:"name" json:"name"`
	ShortName string `db:"short_name" json:"short_name"`
	Status    string `db:"status" json:"status"`
	CreatedBy string `db:"created_by"`
	SubjectId string
	Roles     []int
}
type CriteriaUpdateRequest struct {
	Id        int    `db:"id"`
	ContentId int    `db:"content_id" json:"content_id"`
	Name      string `db:"name" json:"name"`
	ShortName string `db:"short_name" json:"short_name"`
	Status    string `db:"status" json:"status"`
	UpdatedBy string `db:"updated_by"`
	SubjectId string
	Roles     []int
}

////////////////////////////////////////////////////////////

type LearningContentCreateRequest struct {
	CriteriaId int    `db:"criteria_id" json:"criteria_id"`
	Name       string `db:"name" json:"name"`
	Status     string `db:"status" json:"status"`
	CreatedBy  string `db:"created_by"`
	SubjectId  string
	Roles      []int
}
type LearningContentUpdateRequest struct {
	Id         int    `db:"id"`
	CriteriaId int    `db:"criteria_id" json:"criteria_id"`
	Name       string `db:"name" json:"name"`
	Status     string `db:"status" json:"status"`
	UpdatedBy  string `db:"updated_by"`
	SubjectId  string
	Roles      []int
}

///////////////////////////////////////////////////////////

type IndicatorsCreateRequest struct {
	LearningContentId int    `db:"learning_content_id" json:"learning_content_id"`
	Name              string `db:"name" json:"name"`
	ShortName         string `db:"short_name" json:"short_name"`
	TranscriptName    string `db:"transcript_name" json:"transcript_name"`
	Status            string `db:"status" json:"status"`
	CreatedBy         string `db:"created_by"`
	SubjectId         string
	Roles             []int
}
type IndicatorsUpdateRequest struct {
	Id                int    `db:"id"`
	LearningContentId int    `db:"learning_content_id" json:"learning_content_id"`
	Name              string `db:"name" json:"name"`
	ShortName         string `db:"short_name" json:"short_name"`
	TranscriptName    string `db:"transcript_name" json:"transcript_name"`
	Status            string `db:"status" json:"status"`
	UpdatedBy         string `db:"updated_by"`
	SubjectId         string
	Roles             []int
}

// //////////////////////////////////////////////////////////
type SubCriteriaUpdateRequest struct {
	Id                int    `db:"id"`
	CurriculumGroupId int    `db:"curriculum_group_id" json:"curriculum_group_id"`
	Name              string `db:"name" json:"name"`
	UpdatedBy         string `db:"updated_by"`
	SubjectId         string
	Roles             []int
}
type SubCriteriaTopicsCreateRequest struct {
	IndicatorId   int    `db:"indicator_id" json:"indicator_id"`
	Name          string `db:"name" json:"name"`
	ShortName     string `db:"short_name" json:"short_name"`
	Status        string `db:"status" json:"status"`
	CreatedBy     string `db:"created_by"`
	SubCriteriaId int    `db:"sub_criteria_id" json:"sub_criteria_id"`
	YearId        int    `db:"year_id" json:"year_id"`
	SubjectId     string
	Roles         []int
}
type SubCriteriaTopicsUpdateRequest struct {
	Id            int    `db:"id" `
	IndicatorId   int    `db:"indicator_id" json:"indicator_id"`
	Name          string `db:"name" json:"name"`
	ShortName     string `db:"short_name" json:"short_name"`
	Status        string `db:"status" json:"status"`
	UpdatedBy     string `db:"updated_by"`
	SubCriteriaId int    `db:"sub_criteria_id" json:"sub_criteria_id"`
	YearId        int    `db:"year_id" json:"year_id"`
	SubjectId     string
	Roles         []int
}

type ListRequest struct {
	CurriculumGroupId int `json:"curriculum_group_id"`
	SubjectId         string
	Roles             []int
}
type LearningAreaFilter struct {
	Id         int    `query:"id"`
	SearchText string `query:"search_text"`
	YearId     int    `query:"year_id"`
	Status     string `query:"status"`
}
type ContentFilter struct {
	Id             int    `query:"id"`
	SearchText     string `query:"search_text"`
	YearId         int    `query:"year_id"`
	LearningAreaId int    `query:"learning_area_id"`
	Status         string `query:"status"`
}
type CriteriaFilter struct {
	Id             int    `query:"id"`
	SearchText     string `query:"search_text"`
	YearId         int    `query:"year_id"`
	LearningAreaId int    `query:"learning_area_id"`
	ContentId      int    `query:"content_id"`
	Status         string `query:"status"`
}
type LearningContentFilter struct {
	Id             int    `query:"id"`
	SearchText     string `query:"search_text"`
	YearId         int    `query:"year_id"`
	LearningAreaId int    `query:"learning_area_id"`
	ContentId      int    `query:"content_id"`
	CriteriaId     int    `query:"criteria_id"`
	Status         string `query:"status"`
}
type IndicatorsFilter struct {
	Id                int    `query:"id"`
	SearchText        string `query:"search_text"`
	YearId            int    `query:"year_id"`
	LearningAreaId    int    `query:"learning_area_id"`
	ContentId         int    `query:"content_id"`
	CriteriaId        int    `query:"criteria_id"`
	LearningContentId int    `query:"learning_content_id"`
	Status            string `query:"status"`
}
type TopicsFilter struct {
	Id                int    `query:"id"`
	SearchText        string `query:"search_text"`
	YearId            int    `query:"year_id"`
	LearningAreaId    int    `query:"learning_area_id"`
	ContentId         int    `query:"content_id"`
	CriteriaId        int    `query:"criteria_id"`
	LearningContentId int    `query:"learning_content_id"`
	IndicatorsId      int    `query:"indicator_id"`
	Status            string `query:"status"`
}

type CsvDowloadRequest struct {
	CurriculumGroupId int    `query:"curriculum_group_id"`
	StartDate         string `query:"start_date"`
	EndDate           string `query:"end_date"`
}

type CsvDowloadRequestsct struct {
	StartDate string `query:"start_date"`
	EndDate   string `query:"end_date"`
}
type CSVUploadRequest struct {
	Csvfile           *multipart.FileHeader `form:"csv_file"`
	AdminLoginAs      *string               `form:"admin_login_as"`
	CurriculumGroupId int                   `form:"curriculum_group_id" validate:"required"`
	SubjectId         string
	Roles             []int
}
type CSVUploadRequestSCT struct {
	Csvfile      *multipart.FileHeader `form:"csv_file"`
	AdminLoginAs *string               `form:"admin_login_as"`
	SubjectId    string
	Roles        []int
}

type CheckAdmin struct {
	SubjectId string
	Roles     []int
}

var LearningContentCSVHeader = []string{"No", "ID(ห้ามแก้)", "สาระการเรียนรู้", "ชื่อย่อมาตรฐาน", "มาตรฐาน", "สถานะ"}
var IndicatorCSVHeader = []string{"No", "ID(ห้ามแก้)", "ชื่อย่อตัวชี้วัด", "ชื่อบน ปพ", "ตัวชี้วัด/ผลการเรียนรู้", "สาระการเรียนรู้", "สถานะ"}
var SubCriteriaTopicCSVHeader = []string{"No", "ID(ห้ามแก้)", "ชื่อตัวชี้วัด", "ชั้นปี(ย่อ)", "ชื่อย่อ", "ชื่อหัวข้อมาตรฐานย่อย", "สถานะ"}
var ReportCSVHeader = []string{"No", "รหัสตัวชี้วัด", "ชื่อย่อตัวชีวัด", "ชั้นปี(ย่อ)", "ชื่อสาระ", "มาตรฐาน", "สาระการเรียนรู้", "ตัวชี้วัด/ผลการเรียนรู้", "บทเรียนหลัก", "บทเรียนย่อย", "ด่านที่"}
