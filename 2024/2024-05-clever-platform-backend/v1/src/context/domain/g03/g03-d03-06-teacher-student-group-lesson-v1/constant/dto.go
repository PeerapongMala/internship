package constant

type LessonLevelStat struct {
	Index             int       `json:"index"`
	LessonName        string    `json:"lesson_name"`
	SubLessonName     string    `json:"sub_lesson_name"`
	LevelIndex        int       `json:"level_index"`
	LevelType         string    `json:"level_type"`
	LevelQuestionType string    `json:"level_question_type"`
	LevelDifficulty   string    `json:"level_difficulty"`
	AvgScorePerLevel  ScoreStat `json:"avg_score_per_level"`
	TotalAttempt      int       `json:"total_attempt"`
	AverageTimeUsed   float32   `json:"average_time_used"`
}
