package constant

import (
	"time"

	teacherStudentConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
)

type BaseStat struct {
	AverageTimeUsed     float32    `json:"average_time_used"`
	AverageTotalAttempt float32    `json:"average_total_attempt"`
	LastPlayedAt        *time.Time `json:"last_played_at"`
}

type LevelStatistics teacherStudentConstant.LevelStatistics

type AvgLevelStatistic struct {
	Value float32 `json:"value"`
	Total int     `json:"total"`
}

type OptionItem teacherStudentConstant.OptionItem

type OptionObject struct {
	OptionType string       `json:"option_type"`
	ParentKey  *string      `json:"parent_key"`
	Values     []OptionItem `json:"values"`
}

type LevelGroup teacherStudentConstant.LevelGroup

type LessonStat struct {
	CurriculumGroupShortName string            `json:"curriculum_group_short_name"`
	SubjectName              string            `json:"subject_name"`
	LessonId                 int               `json:"lesson_id"`
	LessonIndex              int               `json:"lesson_index"`
	LessonName               string            `json:"lesson_name"`
	TotalPassedLevel         LevelStatistics   `json:"total_passed_level"`
	TotalScore               AvgLevelStatistic `json:"total_score"`
	BaseStat
}

type SubLessonStat struct {
	SubLessonId      int               `json:"sub_lesson_id"`
	SubLessonIndex   int               `json:"sub_lesson_index"`
	SubLessonName    string            `json:"sub_lesson_name"`
	LevelGruop       LevelGroup        `json:"level_group"`
	TotalPassedLevel LevelStatistics   `json:"total_passed_level"`
	TotalScore       AvgLevelStatistic `json:"total_score"`
	BaseStat
}

type LevelStat struct {
	LevelId       int               `json:"level_id"`
	LevelIndex    int               `json:"level_index"`
	LevelType     string            `json:"level_type"`
	QuestionType  string            `json:"question_type"`
	Difficulty    string            `json:"difficulty"`
	TotalScore    AvgLevelStatistic `json:"total_score"`
	UserPlayCount LevelStatistics   `json:"user_play_count"`
	TotalAttempt  int               `json:"total_attempt"`
	BaseStat
}

type PlayLogStat struct {
	UserId           string            `json:"user_id"`
	StudentIndex     int               `json:"student_index"`
	StudentId        string            `json:"student_id"`
	StudentTitle     string            `json:"student_title"`
	StudentFirstName string            `json:"student_first_name"`
	StudentLastName  string            `json:"student_last_name"`
	TotalPassedLevel LevelStatistics   `json:"total_passed_level"`
	TotalScore       AvgLevelStatistic `json:"total_score"`
	TotalAttempt     int               `json:"total_attempt"`
	AverageTimeUsed  float32           `json:"average_time_used"`
	LastestLoginAt   *time.Time        `json:"lastest_login_at"`
}

type StudyGroupListReq struct {
	ClassIDs     []int  `query:"class_ids"`
	Year         string `query:"year"`
	AcademicYear int    `query:"academic_year"`
}
