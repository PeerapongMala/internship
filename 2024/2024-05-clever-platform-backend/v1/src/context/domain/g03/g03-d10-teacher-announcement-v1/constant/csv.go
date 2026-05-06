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

var TeacherAnnounceCsvHeader = []string{"No", "ID(ห้ามแก้)", "ชื่อโรงเรียน", "ขอบเขต(โรงเรียน/วิชา)", "ประเภทของประกาศ", "คำนำ", "คำอธิบาย", "วันเริ่มต้น", "วันสิ้นสุด", "สถานะ"}
