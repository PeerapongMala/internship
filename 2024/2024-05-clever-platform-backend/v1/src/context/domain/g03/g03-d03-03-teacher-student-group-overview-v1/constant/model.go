package constant

import "time"

type ListLessonFilterFilter struct {
	StudyGroupId int `query:"study_group_id" validate:"required"`
}

type ListSubLessonFilterFilter struct {
	StudyGroupId int `query:"study_group_id" validate:"required"`
	LessonId     int `query:"lesson_id" validate:"required"`
}

type GetOverviewStatsFilter struct {
	StudyGroupId int        `query:"study_group_id" validate:"required"`
	LessonIds    []int      `query:"lesson_ids" validate:"required"`
	SubLessonIds []int      `query:"sub_lesson_ids"`
	StartAt      *time.Time `query:"start_at"`
	EndAt        *time.Time `query:"end_at"`
}

type GetLevelOverviewFilter struct {
	StudyGroupId int        `query:"study_group_id" validate:"required"`
	LessonIds    []int      `query:"lesson_ids" validate:"required"`
	SubLessonIds []int      `query:"sub_lesson_ids" `
	StartAt      *time.Time `query:"start_at"`
	EndAt        *time.Time `query:"end_at"`
}

type GetTopStudentsFilter struct {
	StudyGroupId int        `query:"study_group_id" validate:"required"`
	LessonIds    []int      `query:"lesson_ids" validate:"required"`
	SubLessonIds []int      `query:"sub_lesson_ids"`
	Limit        *int       `query:"limit"`
	StartAt      *time.Time `query:"start_at"`
	EndAt        *time.Time `query:"end_at"`
}

type GetLastLoggedInStudentsFilter struct {
	StudyGroupId int       `query:"study_group_id" validate:"required"`
	StartAt      time.Time `query:"start_at" validate:"required"`
	EndAt        time.Time `query:"end_at" validate:"required"`
}

type GetNotParticipateStudentsFilter struct {
	LessonIds    []int     `query:"lesson_ids" validate:"required"`
	SubLessonIds []int     `query:"sub_lesson_ids"`
	StudyGroupId int       `query:"study_group_id" validate:"required"`
	StartAt      time.Time `query:"start_at" validate:"required"`
	EndAt        time.Time `query:"end_at" validate:"required"`
}

type GetLessonProgressionFilter struct {
	LessonId     int       `query:"lesson_id"`
	StudyGroupId int       `query:"study_group_id" validate:"required"`
	StartAt      time.Time `query:"start_at" validate:"required"`
	EndAt        time.Time `query:"end_at" validate:"required"`
}

// ==================== Storage ==========================

type LevelPlayLogFilter struct {
	SubLessonIds []int
	LessonIds    []int
	StartAt      *time.Time
	EndAt        *time.Time
}

type NotParticipateStudentsFilter struct {
	StartAt      *time.Time
	EndAt        *time.Time
	SubLessonIds []int
	LessonIds    []int
}

type TopStudentScoreFilter struct {
	SubLessonIds []int
	Limit        *int
	StartAt      *time.Time
	EndAt        *time.Time
}

type LevelPlayLogsOverviewByStudyGroup struct {
	TotalLevel   int     `db:"total_level_in_study_group"`
	AvgPassLevel float64 `db:"avg_passed_level_per_student"`
	StudentCount int     `db:"student_count"`
	AvgScore     float64 `db:"avg_total_score_per_student"`
	AvgTimeUsed  float64 `db:"avg_time_used"`
	AvgTestTaken float64 `db:"avg_test_taken"`
}
