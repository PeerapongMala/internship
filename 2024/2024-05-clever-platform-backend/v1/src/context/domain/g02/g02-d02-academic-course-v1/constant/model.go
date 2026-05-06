package constant

type PlatformFilter struct {
	CurriculumGroupId int    `params:"curriculumGroupId" validate:"required"`
	PlatformId        int    `query:"platform_id"`
	PlatformName      string `query:"platform_name"`
	Status            string `query:"status"`
}
type YearFilter struct {
	SearchText string `query:"search_text"`
	Status     string `query:"status"`
}

type SubjectGroupFilter struct {
	SearchText string `query:"search_text"`
	Status     string `query:"status"`
}

type SubjectFilter struct {
	CurriculumGroupId int    `params:"curriculumGroupId"`
	PlatformId        int    `query:"platform_id"`
	YearId            int    `query:"year_id"`
	SubjectGroupId    int    `query:"subject_group_id"`
	SubjectId         int    `query:"subject_id"`
	SearchText        string `query:"search_text"`
	Status            string `query:"status"`
}

type YearBulkEditItem struct {
	YearId int    `json:"year_id" validate:"required"`
	Status string `json:"status" validate:"required"`
}

type SubjectGroupBulkEditItem struct {
	SubjectGroupId int    `json:"subject_group_id" validate:"required"`
	Status         string `json:"status" validate:"required"`
}

type SubjectBulkEditItem struct {
	SubjectId int    `json:"subject_id" validate:"required"`
	Status    string `json:"status" validate:"required"`
}

type PlatformBulkEditItem struct {
	PlatformId int    `json:"platform_id" validate:"required"`
	Status     string `json:"status" validate:"required"`
}
