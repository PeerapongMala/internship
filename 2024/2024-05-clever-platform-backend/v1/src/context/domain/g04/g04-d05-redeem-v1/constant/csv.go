package constant

import (
	"mime/multipart"
)

type CsvDowloadRequest struct {
	StartDate string `query:"start_date"`
	EndDate   string `query:"end_date"`
}
type CSVUploadRequest struct {
	Csvfile *multipart.FileHeader `form:"csv_file"`
}

var CouponCsvHeader = []string{"No", "ID(ห้ามแก้)", "รหัสโค้ดคูปอง", "วันที่เวลาเริ่มเผยแพร่", "วันที่เวลาหมดอายุ", "จำนวนคูปองสูงสุด (ใส่-1 ถ้าต้องการเป็นแบบไม่จำกัด)", "เหรียญทอง", "เหรียญ arcade", "น้ำแข็ง", "สถานะ"}