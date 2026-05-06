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

var defaultLimit = sql.NullInt64{
	Int64: 1000000,
	Valid: true,
}

var PaginationDefault = helper.Pagination{
	Page:   1,
	Limit:  defaultLimit,
	Offset: 0,
}

var LearningAreaCSVHeader = []string{"No", "Id(ห้ามแก้)", "ชื่อกลุ่มสาระการเรียนรู้", "รหัสชั้นปี", "ชั้นปี(ย่อ)", "สถานะ"}
var ContentCSVHeader = []string{"No", "Id(ห้ามแก้)", "ชื่อกลุ่มสาระการเรียนรู้", "ชื่อสาระ", "สถานะ"}
var CriteriaCSVHeader = []string{"No", "Id(ห้ามแก้)", "ชื่อย่อ", "มาตราฐาน", "สาระ", "สถานะ"}
