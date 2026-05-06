package constant

import "time"

type SchoolReportFilter struct {
	SchoolId               int        `query:"school_id"`
	SchoolCode             string     `query:"school_code"`
	SchoolName             string     `query:"school_name"`
	SchoolAffiliationGroup string     `query:"school_affiliation_group"`
	InspectionArea         string     `query:"inspection_area"`
	AreaOffice             string     `query:"area_office"`
	DistrictZone           string     `query:"district_zone"`
	District               string     `query:"district"`
	Province               string     `query:"province"`
	LaoDistrict            string     `query:"lao_district"`
	StartDate              *time.Time `query:"start_date"`
	EndDate                *time.Time `query:"end_date"`
}

type ClassReportFilter struct {
	SchoolId     int        `params:"schoolId" validate:"required"`
	AcademicYear string     `query:"academic_year"`
	Year         string     `query:"class_year"`
	ClassName    string     `query:"class_name"`
	StartDate    *time.Time `query:"start_date"`
	EndDate      *time.Time `query:"end_date"`
}

type StudentReportFilter struct {
	ClassId        int        `params:"classId" validate:"required"`
	StudentId      string     `query:"student_id"`
	Title          string     `query:"title"`
	FirstName      string     `query:"first_name"`
	LastName       string     `query:"last_name"`
	StartDate      *time.Time `query:"start_date"`
	EndDate        *time.Time `query:"end_date"`
	ClassLessonIds []int      `query:"class_lesson_ids"`
}

type LessonReportFilter struct {
	UserId              string     `params:"userId" validate:"required"`
	ClassId             int        `query:"class_id"`
	CurriculumGroupId   int        `query:"curriculum_group_id"`
	CurriculumGroupName string     `query:"curriculum_group_name"`
	SubjectId           int        `query:"subject_id"`
	SubjectName         string     `query:"subject_name"`
	LessonId            int        `query:"lesson_id"`
	LessonName          string     `query:"lesson_name"`
	StartDate           *time.Time `query:"start_date"`
	EndDate             *time.Time `query:"end_date"`
	ClassLessonIds      []int      `query:"class_lesson_ids"`
}

type SubLessonReportFilter struct {
	UserId        string     `params:"userId" validate:"required"`
	ClassId       int        `query:"class_id"`
	LessonId      int        `params:"lessonId" validate:"required"`
	SubLessonName string     `query:"sub_lesson_name"`
	SubLessonId   int        `query:"sub_lesson_id"`
	StartDate     *time.Time `query:"start_date"`
	EndDate       *time.Time `query:"end_date"`
}

type LevelReportFilter struct {
	UserId       string     `params:"userId" validate:"required"`
	ClassId      int        `query:"class_id"`
	SubLessonId  int        `params:"subLessonId" validate:"required"`
	LevelIndex   int        `query:"level_index"`
	LevelType    string     `query:"level_type"`
	QuestionType string     `query:"question_type"`
	Difficulty   string     `query:"difficulty"`
	StartDate    *time.Time `query:"start_date"`
	EndDate      *time.Time `query:"end_date"`
}

type LevelPlayLogFilter struct {
	UserId       string     `params:"userId" validate:"required"`
	ClassId      int        `query:"class_id"`
	LevelId      int        `params:"levelId" validate:"required"`
	AcademicYear int        `query:"academic_year"`
	PlayIndex    int        `query:"play_index"`
	StartDate    *time.Time `query:"start_date"`
	EndDate      *time.Time `query:"end_date"`
}

type SubjectFilter struct {
	UserId            string `params:"userId" validate:"required"`
	CurriculumGroupId int    `query:"curriculum_group_id"`
}

type LessonFilter struct {
	UserId            string `params:"userId" validate:"required"`
	CurriculumGroupId int    `query:"curriculum_group_id"`
	SubjectId         int    `query:"subject_id"`
}

type SubLessonFilter struct {
	UserId      string `params:"userId" validate:"required"`
	LessonId    int    `params:"lessonId"`
	SubLessonId int    `query:"sub_lesson_id"`
}
