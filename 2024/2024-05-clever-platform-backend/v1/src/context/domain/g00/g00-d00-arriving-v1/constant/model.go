package constant

type CurriculumGroupFilter struct {
	SearchText       string `query:"search_text"`
	ContentCreatorId string
}
