package constant

import (
	"database/sql"
	"mime/multipart"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type DownloadCSVRequest struct {
	StartDate string `query:"start_date"`
	EndDate   string `query:"end_date"`
}

type UploadCSVRequest struct {
	Csvfile      *multipart.FileHeader `form:"csv_file"`
	AdminLoginAs *string               `form:"admin_login_as"`
	SubjectId    string
}

type StatusResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

var defaultLimit = sql.NullInt64{
	Int64: 1000000,
	Valid: true,
}

var PaginationDefault = helper.Pagination{
	Page:   1,
	Limit:  defaultLimit,
	Offset: 0,
}

var YearCSVHeader = []string{"No", "Id(ห้ามแก้)", "รหัสชั้นปี", "ชื่อชั้นปี", "ชื่อย่อ", "สถานะ"}
var SubjectGroupCSVHeader = []string{"No", "Id(ห้ามแก้)", "รหัสกลุ่มวิชา", "ชื่อกลุ่มวิชา", "สถานะ"}
var SubjectCSVHeader = []string{"No", "Id(ห้ามแก้)", "รหัสหลักสูตร", "กลุ่มวิชา", "วิชา", "ชนิดของภาษา", "ภาษา", "แพลตฟอร์ม", "สถานะ"}
