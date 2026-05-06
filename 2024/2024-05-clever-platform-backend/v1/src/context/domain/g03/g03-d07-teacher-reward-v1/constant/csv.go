package constant

import (
	"mime/multipart"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type CsvDowloadRequest struct {
	StartDate string `query:"start_date"`
	EndDate   string `query:"end_date"`
}

type CSVUploadRequest struct {
	Csvfile    *multipart.FileHeader `form:"csv_file"`
	Pagination *helper.Pagination
}

var TeacherRewardCsvHeader = []string{"No", "ID", "ชื่อวิชา", "ชื่อนักเรียน", "นามสกุลนักเรียน", "ชั้นปี(ข้อมูลใหม่ไม่ต้องกรอก)", "ห้อง(ข้อมูลใหม่ไม่ต้องกรอก)", "ชื่อไอเทม", "จำนวน"}
