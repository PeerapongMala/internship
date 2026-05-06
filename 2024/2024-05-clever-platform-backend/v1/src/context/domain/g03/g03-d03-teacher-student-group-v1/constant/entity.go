package constant

import (
	"time"
)

type StatEntity struct {
	TotalPassedLevel float32    `db:"total_passed_level"`
	Score            *float32   `db:"score"`
	TotalLevel       int        `db:"total_level"`
	TotalAttempt     *int       `db:"total_attempt"`
	AvgTimeUsed      *float32   `db:"avg_time_used"`
	LastPlayedAt     *time.Time `db:"last_played_at"`
}
type LessonStatEntity struct {
	CurriculumGroupShortName string `db:"curriculum_group_short_name"`
	SubjectName              string `db:"subject_name"`
	LessonId                 int    `db:"lesson_id"`
	LessonIndex              int    `db:"lesson_index"`
	LessonName               string `db:"lesson_name"`
	StatEntity
}

type SubLessonStatEntity struct {
	SubLessonId    int    `db:"id"`
	SubLessonIndex int    `db:"index"`
	SubLessonName  string `db:"name"`
	MinLevelGroup  int    `db:"min_level_group"`
	MaxLevelGroup  int    `db:"max_level_group"`
	StatEntity
}

type LevelStatEntity struct {
	LevelId       int    `db:"id"`
	LevelIndex    int    `db:"index"`
	LevelType     string `db:"level_type"`
	QuestionType  string `db:"question_type"`
	Difficulty    string `db:"difficulty"`
	UserPlayCount int    `db:"user_play_count"`
	StatEntity
}

type PlayLogStatEntity struct {
	UserId           string     `db:"user_id"`
	StudentId        string     `db:"student_id"`
	StudentTitle     string     `db:"student_title"`
	StudentFirstName string     `db:"student_first_name"`
	StudentLastName  string     `db:"student_last_name"`
	LastestLoginAt   *time.Time `db:"lastest_login"`
	StatEntity
}
