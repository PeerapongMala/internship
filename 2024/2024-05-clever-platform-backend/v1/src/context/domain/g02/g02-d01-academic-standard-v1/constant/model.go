package constant

type LearningAreaBulkEditItem struct {
	LearningAreaId int    `json:"learning_area_id" validate:"required"`
	Status         string `json:"status" validate:"required"`
}

type ContentBulkEditItem struct {
	ContentId int    `json:"content_id" validate:"required"`
	Status    string `json:"status" validate:"required"`
}

type CriteriaBulkEditItem struct {
	CriteriaId int    `json:"criteria_id" validate:"required"`
	Status     string `json:"status" validate:"required"`
}

type LearningContentBulkEditItem struct {
	LearningContentId int    `json:"learning_content_id" validate:"required"`
	Status            string `json:"status" validate:"required"`
}

type IndicatorBulkEditItem struct {
	IndicatorId int    `json:"indicator_id" validate:"required"`
	Status      string `json:"status" validate:"required"`
}

type SubCriteriaTopicBulkEditItem struct {
	SubCriteriaTopicId int    `json:"sub_criteria_topic_id" validate:"required"`
	Status             string `json:"status" validate:"required"`
}
