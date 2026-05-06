package constant

type LessonBulkEditItem struct {
	LessonId int    `json:"lesson_id" validate:"required"`
	Status   string `json:"status" validate:"required"`
}

type MonsterCreateItem struct {
	ImagePath string `json:"image_path" db:"image_path" validate:"required"`
	LevelType string `json:"level_type" db:"level_type" validate:"required"`
}
