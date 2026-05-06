package constant

type LessonLevelStatEntity struct {
	Index              int      `db:"index"`
	LessonName         string   `db:"lesson_name"`
	SubLessonName      string   `db:"sub_lesson_name"`
	LevelType          string   `db:"level_type"`
	LevelQuestionType  string   `db:"question_type"`
	LevelDifficulty    string   `db:"difficulty"`
	TotalStudentPlayed *int     `db:"total_student_played"`
	Score              *float32 `db:"score"`
	TotalAttempt       *int     `db:"total_attempt"`
	AvgTimeUsed        *float32 `db:"avg_time_used"`
}

type LessonParamsEntity struct {
	ID     int    `db:"id" json:"id"`
	Index  int    `db:"index" json:"index"`
	Label  string `db:"name" json:"label"`
	Status string `db:"status" json:"status"`
}

type SubLessonParamsEntity struct {
	ID     int    `db:"id" json:"id"`
	Index  int    `db:"index" json:"index"`
	Label  string `db:"name" json:"label"`
	Status string `db:"status" json:"status"`
}
