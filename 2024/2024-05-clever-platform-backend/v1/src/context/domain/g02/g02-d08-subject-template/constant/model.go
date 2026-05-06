package constant

type SubjectTemplateFilter struct {
	Id                int    `query:"id"`
	CurriculumGroupId int    `query:"curriculum_group_id"`
	Name              string `query:"name"`
	SeedYearId        int    `query:"seed_year_id"`
	SubjectId         int    `query:"subject_id"`
	Status            string `query:"status"`
	IncludeIndicators bool   `query:"include_indicators"`
}

type SubjectTemplateBulkEditItem struct {
	Id     int    `json:"id" validate:"required"`
	Status string `json:"status" validate:"required"`
}
