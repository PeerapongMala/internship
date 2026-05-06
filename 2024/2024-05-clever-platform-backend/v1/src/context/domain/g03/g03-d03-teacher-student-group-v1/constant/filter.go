package constant

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type OptionFilter struct {
	OptionParam
	OptionType string `query:"option_type" validate:"required"`
}

type OptionParam struct {
	TeacherId    string
	StudyGroupId int
	LessonId     *int       `query:"lesson_id"`
	StartDate    *time.Time `query:"start_date"`
	EndDate      *time.Time `query:"end_date"`
}

type LessonStatFilter struct {
	TeacherId    string
	StudyGroupId int
	StudentIds   []string
	Search       string `query:"search"`
	AcademicYear *int   `query:"academic_year"`
	helper.DateFilterBase
	SubjectId  *int `query:"subject_id"`
	LessonId   *int `query:"lesson_id"`
	Pagination *helper.Pagination
}

type SubLessonStatFilter struct {
	TeacherId    string
	StudyGroupId int
	StudentIds   []string
	LessonId     int
	Search       string `query:"search"`
	AcademicYear *int   `query:"academic_year"`
	helper.DateFilterBase
	SubLessonId *int `query:"sub_lesson_id"`
	Pagination  *helper.Pagination
}

type LevelStatFilter struct {
	TeacherId    string
	StudyGroupId int
	StudentIds   []string
	SubLessonId  int
	Search       string `query:"search"`
	AcademicYear *int   `query:"academic_year"`
	helper.DateFilterBase
	QuestionType string `query:"question_type"`
	Difficulty   string `query:"difficulty"`
	LevelType    string `query:"level_type"`
	Pagination   *helper.Pagination
}

type PlayLogStatFilter struct {
	TeacherId    string
	StudyGroupId int
	StudentIds   []string
	Search       string `query:"search"`
	helper.DateFilterBase
}

type StudyGroupListFilter struct {
	StudyGroupListReq
	Pagination *helper.Pagination
}
