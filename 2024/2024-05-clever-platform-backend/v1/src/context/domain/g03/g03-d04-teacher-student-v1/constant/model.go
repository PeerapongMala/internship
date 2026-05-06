package constant

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type StudentParam struct {
	StudentId string
	UserId    string
}

type StudentListByTeacherIdFilter struct {
	AcademicYear string `query:"academic_year"`
	Year         string `query:"year"`
	Name         string `query:"name"`
	Search       string `query:"search"`
	SchoolId     int    `query:"school_id"`
	ClassId      int    `query:"class_id"`
}

type TeacherStudentListWithStatFilter struct {
	AcademicYear      string  `query:"academic_year"`
	StartDate         *string `query:"startDate"`
	EndDate           *string `query:"endDate"`
	Year              string  `query:"year"`
	Name              string  `query:"class_name"`
	Search            string  `query:"search"`
	CurriculumGroupId int     `query:"curriculum_group_id"`
	SubjectId         int     `query:"subject_id"`
	LessonId          int     `query:"lesson_id"`
	SubLessonId       int     `query:"sub_lesson_id"`
	SchoolId          int     `query:"school_id"`
	ClassId           int     `query:"class_id"`
}

type LessonStatAcademicYearListFilter struct {
	Search string `query:"search"`
	Year   string `query:"class_year"`
	Name   string `query:"class_name"`
}

type StudentAcademicYearStatFilter struct {
	Search            string `query:"search"`
	CurriculumGroupId int    `query:"curriculum_group_id"`
	SeedYearId        int    `query:"seed_year_id"`
	SubjectId         int    `query:"subject_id"`
	LessonId          int    `query:"lesson_id"`
	Pagination        *helper.Pagination
}

type LessonStatFilter struct {
	Search string `query:"search"`
	helper.DateFilterBase
	SubLessonId int `query:"sub_lesson_id"`
	Pagination  *helper.Pagination
}

type SubLessonStatFilter struct {
	Search string `query:"search"`
	helper.DateFilterBase
	QuestionType string `query:"question_type"`
	Difficulty   string `query:"difficulty"`
	LevelType    string `query:"level_type"`
	Pagination   *helper.Pagination
}

type ItemFilter struct {
	Student      StudentParam
	AcademicYear int

	Search string `query:"search"`
	helper.DateFilterBase
	CurriculumGroupId int `query:"curriculum_group_id"`
	SubjectId         int `query:"subject_id"`
}

type OptionParam struct {
	Student      StudentParam
	TeacherId    string
	AcademicYear *int
	LessonId     *int
	SeedYearId   int `query:"seed_year_id"`
	SubjectId    int `query:"subject_id"`
	SubLessonId  int `query:"sub_lesson_id"`
}

type OptionFilter struct {
	Param       OptionParam
	OptionType  string `query:"option_type"`
	SeedYearId  int    `query:"seed_year_id"`
	LessonId    int    `query:"lesson_id"`
	SubjectId   int    `query:"subject_id"`
	SubLessonId int    `query:"sub_lesson_id"`
}
type StudyGroupFilter struct {
	Student      StudentParam
	AcademicYear int    `query:"academic_year"`
	Search       string `query:"search"`
}

type TeacherCommentFilter struct {
	Student      StudentParam
	AcademicYear int
	Search       string `query:"search"`
	helper.DateFilterBase
	CurriculumGroupId int `query:"curriculum_group_id"`
	SubjectId         int `query:"subject_id"`
	LessonId          int `query:"lesson_id"`
	SubLessonId       int `query:"sub_lesson_id"`
}

type SubjectListByTeacherIdResponse struct {
	TeacherStudentFilter
	SeedYearShortName string `json:"seed_year_short_name" db:"seed_year_short_name" `
}

type ClassListByTeacherIdAndAcademicYearAndYearRequest struct {
	Year         string `params:"year" `
	AcademicYear int    `params:"academic_year"`
	SubjectID    int    `params:"subject_id"`
}
type ClassListByTeacherIdAndAcademicYearAndYearData struct {
	TeacherStudentFilter
	Year string `json:"year" db:"year"`
}

type SubjectListGetByAcademicYearYearRequest struct {
	Year         string `params:"year"`
	AcademicYear int    `params:"academic_year"`
}
