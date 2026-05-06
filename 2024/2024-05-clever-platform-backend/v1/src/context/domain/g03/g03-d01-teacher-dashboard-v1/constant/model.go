package constant

import "time"

// ==================== Transport ==========================

type ListYearFilterFilter struct {
	AcademicYear *int `query:"academic_year"`
}

type ListClassFilterFilter struct {
	AcademicYear *int    `query:"academic_year"`
	Year         *string `query:"year"`
}

type GetTotalStudentsFilter struct {
	AcademicYear  *int    `query:"academic_year"`
	Year          *string `query:"year"`
	ClassId       *int    `query:"class_id"`
	StudyGroupIds []int   `query:"study_group_ids"`
}

type GetLatestHomeworkOverviewFilter struct {
	AcademicYear   int        `query:"academic_year"`
	Year           string     `query:"year"`
	ClassIds       []int      `query:"class_ids" validate:"required"`
	LessonId       int        `query:"lesson_ids"`
	StartDate      *time.Time `query:"start_date"`
	EndDate        *time.Time `query:"end_date"`
	StudyGroupsIds []int      `query:"study_group_ids"`
}

type GetLevelOverviewFilter struct {
	AcademicYear  int    `query:"academic_year"`
	Year          string `query:"year"`
	ClassIds      []int  `query:"class_ids" validate:"required"`
	LessonId      int    `query:"lesson_ids"`
	StudyGroupIds []int  `query:"study_group_ids"`
}

type GetQuestionOverviewFilter struct {
	AcademicYear  int    `query:"academic_year"`
	Year          string `query:"year"`
	ClassIds      []int  `query:"class_ids" validate:"required"`
	LessonId      int    `query:"lesson_ids"`
	StudyGroupIds []int  `query:"study_group_ids"`
}

type GetScoreOverviewFilter struct {
	AcademicYear  int    `query:"academic_year"`
	Year          string `query:"year"`
	ClassIds      []int  `query:"class_ids" validate:"required"`
	LessonId      int    `query:"lesson_ids"`
	StudyGroupIds []int  `query:"study_group_ids"`
}

type ListSubjectFilterFilter struct {
	AcademicYear int    `query:"academic_year"`
	Year         string `query:"year"`
	ClassIds     []int  `query:"class_ids" validate:"required"`
}

type ListLessonFilterFilter struct {
	AcademicYear int    `query:"academic_year"`
	Year         string `query:"year"`
	ClassIds     []int  `query:"class_ids" validate:"required"`
	SubjectIds   []int  `query:"subject_ids" validate:"required"`
}

type GetTopStudenetFilter struct {
	AcademicYear  int    `query:"academic_year"`
	Year          string `query:"year"`
	ClassIds      []int  `query:"class_ids" validate:"required"`
	StudyGroupIds []int  `query:"study_group_ids"`
	SubjectIds    []int  `query:"subject_ids" validate:"required"`
	LessonIds     []int  `query:"lesson_ids" validate:"required"`
	// Limit        int    `query:"limit" validate:"required"`
}

type GetBottomStudenetFilter struct {
	AcademicYear  int    `query:"academic_year"`
	Year          string `query:"year"`
	ClassIds      []int  `query:"class_ids" validate:"required"`
	StudyGroupIds []int  `query:"study_group_ids"`
	SubjectIds    []int  `query:"subject_ids" validate:"required"`
	LessonIds     []int  `query:"lesson_ids" validate:"required"`
	// Limit        int    `query:"limit" validate:"required"`
}

type GetLessonOverviewFilter struct {
	AcademicYear  int       `query:"academic_year"`
	StartAt       time.Time `query:"start_at" validate:"required"`
	EndAt         time.Time `query:"end_at" validate:"required"`
	Year          string    `query:"year"`
	ClassIds      []int     `query:"class_ids" validate:"required"`
	StudyGroupIds []int     `query:"study_group_ids"`
	SubjectIds    []int     `query:"subject_ids" validate:"required"`
}

type GetSubLessonOverviewFilter struct {
	AcademicYear  int       `query:"academic_year"`
	StartAt       time.Time `query:"start_at" validate:"required"`
	EndAt         time.Time `query:"end_at" validate:"required"`
	Year          string    `query:"year"`
	ClassIds      []int     `query:"class_ids" validate:"required"`
	StudyGroupIds []int     `query:"study_group_ids"`
	SubjectIds    []int     `query:"subject_ids" validate:"required"`
	LessonIds     []int     `query:"lesson_ids" validate:"required"`
}

type GetHomeworkOverviewFilter struct {
	ClassIds      []int     `query:"class_ids" validate:"required"`
	StudyGroupIds []int     `query:"study_group_ids"`
	LessonIds     []int     `query:"lesson_ids" validate:"required"`
	StartAt       time.Time `query:"start_at" validate:"required"`
	EndAt         time.Time `query:"end_at" validate:"required"`

	// วันที่สั่งการบ้าน
	StartDateStartAt *time.Time `query:"start_date_start_at"`
	StartDateEndAt   *time.Time `query:"start_date_end_at"`
	// วันกำหนดส่ง
	DueDateStartAt *time.Time `query:"due_date_start_at"`
	DueDateEndAt   *time.Time `query:"due_date_end_at"`
	// วันที่ปิดรับการบ้าน
	ClosedDateStartAt *time.Time `query:"closed_date_start_at"`
	ClosedDateEndAt   *time.Time `query:"closed_date_end_at"`
}

// ==================== Storage ==========================

type ClassFilter struct {
	AcademicYears []int
	Years         []string
}

type HomeworkFilter struct {
	TeacherId     string
	Year          string
	ClassIds      []int
	Limit         *int
	LessonId      int
	StartDate     *time.Time
	EndDate       *time.Time
	StudyGroupIds []int
}

type LevelPlayLogFilter struct {
	Ids           []int
	HomeworkIds   []int
	ClassIds      []int
	StartAt       *time.Time
	EndAt         *time.Time
	LevelIds      []int
	StudyGroupIds []int
}

type HomeworkFromLessonIdsFilter struct {
	StartDateStartAt  *time.Time
	StartDateEndAt    *time.Time
	DueDateStartAt    *time.Time
	DueDateEndAt      *time.Time
	ClosedDateStartAt *time.Time
	ClosedDateEndAt   *time.Time
}
