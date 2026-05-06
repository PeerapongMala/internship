package constant

import (
	"mime/multipart"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type DownloadCSVInput struct {
	Pagination *helper.Pagination
}

type UploadCSVInput struct {
	Csvfile    *multipart.FileHeader `form:"csv_file"`
	Pagination *helper.Pagination
	SubjectId  string
}

var AdminCSVHeader = []string{"No", "Id(ห้ามแก้)", "คำนำหน้า", "ชื่อ", "นามสกุล", "อีเมล", "รหัสผ่าน", "สถานะ", "ความรับผิดชอบ"}
var ParentCSVHeader = []string{"No", "Id(ห้ามแก้)", "คำนำหน้า", "ชื่อ", "นามสกุล", "อีเมล", "สถานะ", "ความสัมพันธ์"}
var ObserverCSVHeader = []string{"No", "Id(ห้ามแก้)", "คำนำหน้า", "ชื่อ", "นามสกุล", "อีเมล", "รหัสผ่าน", "สถานะ", "ความรับผิดชอบ"}
var ContentCreatorCSVHeader = []string{"No", "Id(ห้ามแก้)", "คำนำหน้า", "ชื่อ", "นามสกุล", "อีเมล", "รหัสผ่าน", "สถานะ"}
