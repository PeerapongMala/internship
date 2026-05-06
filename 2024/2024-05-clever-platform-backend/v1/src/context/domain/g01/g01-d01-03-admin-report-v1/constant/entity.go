package constant

type SchoolStatsEntity struct {
	SchoolCount    *int `json:"school_count" db:"school_count"`
	ClassRoomCount *int `json:"class_room_count" db:"class_room_count"`
	StudentCount   *int `json:"student_count" db:"student_count"`
}

type StatPlayCountEntity struct {
	StudentCount *int `json:"student_count" db:"student_count"`
	MaxTotalStar *int `json:"max_total_star" db:"max_total_star"`
	SumTotalStar *int `json:"sum_total_star" db:"sum_total_star"`
	MinTotalStar *int `json:"min_total_star" db:"min_total_star"`
}

type AvgStatByProvinceEntity struct {
	District     *string  `json:"district" db:"district"`
	AvgTotalStar *float64 `json:"avg_total_star" db:"avg_total_star"`
	SumTotalStar *int     `json:"sum_total_star" db:"sum_total_star"`
}

type TreeDistrictDataEntity struct {
	Id           *int     `db:"id"`
	AcademicYear *int     `db:"academic_year"`
	Name         *string  `db:"name"`
	MaxStarCount *int     `db:"max_star_count"`
	AvgStarCount *float64 `db:"avg_star_count"`
	AvgPassLevel *float64 `db:"avg_pass_level"`
}
