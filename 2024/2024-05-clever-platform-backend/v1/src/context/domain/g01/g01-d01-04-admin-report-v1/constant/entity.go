package constant

import "time"

type SchoolReportEntity struct {
	SchoolId            *int     `json:"school_id" db:"school_id"`
	SchoolCode          *string  `json:"school_code" db:"school_code"`
	SchoolName          *string  `json:"school_name" db:"school_name"`
	ClassCount          *int     `json:"class_count" db:"class_count"`
	StudentCount        *int     `json:"student_count" db:"student_count"`
	AveragePassedLevels *float64 `json:"average_passed_level" db:"average_passed_levels"`
	TotalLevelsCount    *int     `json:"total_levels_count" db:"total_levels_count"`
	AverageTotalScore   *float64 `json:"average_score" db:"average_score"`
	TotalScore          *float64 `json:"total_score" db:"total_score"`
	PlayCount           *int     `json:"play_count" db:"play_count"`
	AverageTimeUsed     *float64 `json:"average_time_used" db:"average_time_used"`
	TotalCount          int      `json:"-" db:"total_count"`
}

type ClassReportEntity struct {
	AcademicYear        *int     `json:"academic_year" db:"academic_year"`
	ClassId             *int     `json:"class_id" db:"class_id"`
	ClassYear           *string  `json:"class_year" db:"class_year"`
	ClassName           *string  `json:"class_name" db:"class_name"`
	StudentCount        *int     `json:"student_count" db:"student_count"`
	ActiveStudentCount  *int     `json:"active_student_count" db:"active_student_count"`
	AveragePassedLevels *float64 `json:"average_passed_level" db:"average_passed_levels"`
	TotalLevelsCount    *int     `json:"total_levels_count" db:"total_levels_count"`
	AverageTotalScore   *float64 `json:"average_score" db:"average_score"`
	TotalScore          *float64 `json:"total_score" db:"total_score"`
	PlayCount           *int     `json:"play_count" db:"play_count"`
	AverageTimeUsed     *float64 `json:"average_time_used" db:"average_time_used"`
	TotalCount          int      `json:"-" db:"total_count"`
}

type StudentReportEntity struct {
	UserId           *string    `json:"user_id" db:"user_id"`
	StudentId        *string    `json:"student_id" db:"student_id"`
	Title            *string    `json:"title" db:"title"`
	FirstName        *string    `json:"first_name" db:"first_name"`
	LastName         *string    `json:"last_name" db:"last_name"`
	PassedLevelCount *float64   `json:"passed_level_count" db:"passed_level_count"`
	TotalLevelsCount *int       `json:"total_levels_count" db:"total_levels_count"`
	Score            *int       `json:"score" db:"score"`
	TotalScore       *float64   `json:"total_score" db:"total_score"`
	PlayCount        *int       `json:"play_count" db:"play_count"`
	AverageTimeUsed  *float64   `json:"average_time_used" db:"average_time_used"`
	LastLogin        *time.Time `json:"last_login" db:"last_login"`
	TotalCount       int        `json:"-" db:"total_count"`
}

type LessonReportEntity struct {
	CurriculumGroupShortName *string    `json:"curriculum_group_short_name" db:"curriculum_group_short_name"`
	Subject                  *string    `json:"subject" db:"subject"`
	LessonId                 *int       `json:"lesson_id" db:"lesson_id"`
	LessonName               *string    `json:"lesson_name" db:"lesson_name"`
	LessonIndex              *int       `json:"lesson_index" db:"lesson_index"`
	PassedLevelCount         *float64   `json:"passed_level_count" db:"passed_level_count"`
	TotalLevelsCount         *int       `json:"total_level_count" db:"total_level_count"`
	Score                    *int       `json:"score" db:"score"`
	TotalScore               *float64   `json:"total_score" db:"total_score"`
	PlayCount                *int       `json:"play_count" db:"play_count"`
	AverageTimeUsed          *float64   `json:"average_time_used" db:"average_time_used"`
	LastLogin                *time.Time `json:"last_login" db:"last_login"`
	TotalCount               int        `json:"-" db:"total_count"`
}

type SubLessonReportEntity struct {
	LessonIndex      *int       `json:"lesson_index" db:"lesson_index"`
	SubLessonIndex   *int       `json:"sub_lesson_index" db:"sub_lesson_index"`
	SubLessonId      *int       `json:"sub_lesson_id" db:"sub_lesson_id"`
	SubLessonName    *string    `json:"sub_lesson_name" db:"sub_lesson_name"`
	PassedLevelCount *int       `json:"passed_level_count" db:"passed_level_count"`
	TotalLevelCount  *int       `json:"total_level_count" db:"total_level_count"`
	Score            *int       `json:"score" db:"score"`
	TotalScore       *int       `json:"total_score" db:"total_score"`
	PlayCount        *int       `json:"play_count" db:"play_count"`
	AverageTimeUsed  *float64   `json:"average_time_used" db:"average_time_used"`
	LastPlayed       *time.Time `json:"last_played" db:"last_played"`
	TotalCount       int        `json:"-" db:"total_count"`
}

type LevelReportEntity struct {
	LevelId         *int       `json:"level_id" db:"level_id"`
	LevelIndex      *int       `json:"level_index" db:"level_index"`
	LevelType       *string    `json:"level_type" db:"level_type"`
	QuestionType    *string    `json:"question_type" db:"question_type"`
	Difficulty      *string    `json:"difficulty" db:"difficulty"`
	Score           *int       `json:"score" db:"score"`
	TotalScore      *int       `json:"total_score" db:"total_score"`
	PlayCount       *int       `json:"play_count" db:"play_count"`
	AverageTimeUsed *float64   `json:"average_time_used" db:"average_time_used"`
	LastPlayed      *time.Time `json:"last_played" db:"last_played"`
	TotalCount      int        `json:"-" db:"total_count"`
}

type LevelPlayLogEntity struct {
	PlayIndex       *int       `json:"play_index" db:"play_index"`
	Id              *int       `json:"id" db:"id"`
	Score           *int       `json:"score" db:"score"`
	AverageTimeUsed *float64   `json:"average_time_used" db:"average_time_used"`
	PlayedAt        *time.Time `json:"played_at" db:"played_at"`
	TotalCount      int        `json:"-" db:"total_count"`
}

type CurriculumGroupEntity struct {
	Id         *int    `json:"id" db:"id"`
	Name       *string `json:"name" db:"name"`
	ShortName  *string `json:"short_name" db:"short_name"`
	TotalCount int     `json:"-" db:"total_count"`
}

type SubjectEntity struct {
	Id         *int    `json:"id" db:"id"`
	Name       *string `json:"name" db:"name"`
	TotalCount int     `json:"-" db:"total_count"`
}

type LessonEntity struct {
	Id         *int    `json:"id" db:"id"`
	Name       *string `json:"name" db:"name"`
	TotalCount int     `json:"-" db:"total_count"`
}

type SubLessonEntity struct {
	Id         *int    `json:"id" db:"id"`
	Name       *string `json:"name" db:"name"`
	TotalCount int     `json:"-" db:"total_count"`
}
