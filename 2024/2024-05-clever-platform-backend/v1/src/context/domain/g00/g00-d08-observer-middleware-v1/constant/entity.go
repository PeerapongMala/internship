package constant

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/lib/pq"
)

type ReportAccess struct { // scope ที่ เข้าถึงได้
	CanAccessAll         bool
	AccessNames          pq.StringArray `db:"access_names"`           // ผู้บริหารกระทรวง, ผู้บริหาร สพป, etc..
	AreaOffices          pq.StringArray `db:"area_offices"`           // สพป
	DistrictZones        pq.StringArray `db:"district_zones"`         // กลุ่มเขต (6 กลุ่ม) ในกทม
	Districts            pq.StringArray `db:"districts"`              // เขต (50 เขต) ใน กทม
	SchoolAffiliationIds pq.Int64Array  `db:"school_affiliation_ids"` // สังกัดโรงเรียน
	SchoolIds            pq.Int64Array  `db:"school_ids"`             // โรงเรียน
}

type ReportAccessSimplify struct {
	CanAccessAll         bool
	AccessNames          []string
	AreaOffices          []string
	DistrictZones        []string
	Districts            []string
	SchoolAffiliationIds []int
	SchoolIds            []int
}

func (r *ReportAccess) Simplyfy() *ReportAccessSimplify {
	return &ReportAccessSimplify{
		CanAccessAll:         r.CanAccessAll,
		AccessNames:          r.AccessNames,
		AreaOffices:          r.AreaOffices,
		DistrictZones:        r.DistrictZones,
		Districts:            r.Districts,
		SchoolAffiliationIds: helper.ConvertPgInt64ToInt(r.SchoolAffiliationIds),
		SchoolIds:            helper.ConvertPgInt64ToInt(r.SchoolIds),
	}
}
