package constant

type SavedTextFilter struct {
	Text     string `query:"text"`
	Language string `query:"language"`
	Status   string `query:"status"`
}

type SavedTextBulkEditItem struct {
	GroupId  string `json:"saved_text_group_id" validate:"required"`
	Language string `json:"language" validate:"required"`
	Sound    *bool  `json:"sound" validate:"required"`
	Status   string `json:"status" validate:"required"`
}
