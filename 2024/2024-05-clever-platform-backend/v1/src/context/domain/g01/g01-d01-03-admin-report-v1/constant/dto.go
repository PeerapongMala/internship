package constant

type ReportProvinceDistrictData struct {
	TotalSchoolCount        int     `json:"total_school_count"`
	TotalClassRoomCount     int     `json:"total_class_room_count"`
	TotalStudentCount       int     `json:"total_student_count"`
	CountryMaximumStarCount int     `json:"country_maximum_star_count"`
	AvgStarCount            float64 `json:"avg_star_count"`
	PercentageStar          float64 `json:"percentage_star"`
	MaximumStarCount        int     `json:"maximum_star_count"`
	MinimumStarCount        int     `json:"minimum_star_count"`
}

type ReportCompareProvinceDistrictData struct {
	StatUsage       []StatUsageData      `json:"stat_usage"`
	OverAllProvince *OverAllProvinceData `json:"over_all_province"`
	TreeDistrict    []TreeDistrictData   `json:"tree_district"`
}

type StatUsageData struct {
	Label string  `json:"label"`
	Value float64 `json:"value"`
}

type OverAllProvinceData struct {
	AvgCountryStarCount float64 `json:"avg_country_star_count"`
	MaxCountryStarCount int     `json:"max_country_star_count"`
	PercentageStar      float64 `json:"percentage_star"`
	AvgStarCount        float64 `json:"avg_star_count"`
	MaxStarCount        int     `json:"max_star_count"`
	MinStarCount        int     `json:"min_star_count"`
}

type TreeDistrictData struct {
	SchoolId     int                `json:"-"`
	ClassRoomId  int                `json:"-"`
	AcademicYear int                `json:"-"`
	Name         string             `json:"name"`
	Type         string             `json:"type"`
	MaxStarCount int                `json:"max_star_count"`
	AvgStarCount float64            `json:"avg_star_count"`
	AvgPassLevel float64            `json:"avg_pass_level"`
	Children     []TreeDistrictData `json:"children"`
}
