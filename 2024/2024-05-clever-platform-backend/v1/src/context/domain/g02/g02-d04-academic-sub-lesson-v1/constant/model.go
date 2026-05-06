package constant

type SubLessonBulkEditItem struct {
	SubLessonId int    `json:"sub_lesson_id" validate:"required"`
	Status      string `json:"status" validate:"required"`
}
