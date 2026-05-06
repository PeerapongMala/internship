package constant

type ReportProvinceDistrictFilter struct {
	StartDate string `query:"start_date" validate:"required"`
	EndDate   string `query:"end_date" validate:"required"`
	Province  string `query:"province" validate:"required"`
	District  string `query:"district" validate:"required"`
}

type ReportCompareProvinceDistrictFilter struct {
	StartDate         string `query:"start_date" validate:"required"`
	EndDate           string `query:"end_date" validate:"required"`
	Province          string `query:"province" validate:"required"`
	District          string `query:"district"`
	SortByAvgStarFlag string `query:"sort_by_avg_star_flag"`
	SortType          string `query:"sort_type"`
}
