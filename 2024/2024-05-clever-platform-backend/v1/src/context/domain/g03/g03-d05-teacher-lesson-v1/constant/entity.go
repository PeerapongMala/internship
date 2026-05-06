package constant

import "time"

type ClassLessonEntity struct {
	LessonId                 int    `json:"lesson_id" db:"lesson_id"`
	CurriculumGroup          string `json:"curriculum_group" db:"curriculum_group"`
	CurriculumGroupShortName string `json:"curriculum_group_short_name" db:"curriculum_group_short_name"`
	SubjectId                *int   `json:"subject_id" db:"subject_id"`
	Subject                  string `json:"subject" db:"subject"`
	Year                     string `json:"year" db:"year"`
	LessonName               string `json:"lesson_name" db:"lesson_name"`
	LessonIndex              int    `json:"lesson_index" db:"lesson_index"`
	IsEnabled                *bool  `json:"is_enabled" db:"is_enabled"`
	IsExtra                  bool   `json:"is_extra" db:"is_extra"`
}

type CurriculumGroupEntity struct {
	Id   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

type SubjectEntity struct {
	Id   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

type LessonEntity struct {
	Id   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

type ClassSubLessonEntity struct {
	SubLessonId              int    `json:"sub_lesson_id" db:"sub_lesson_id"`
	CurriculumGroup          string `json:"curriculum_group" db:"curriculum_group"`
	CurriculumGroupShortName string `json:"curriculum_group_short_name" db:"curriculum_group_short_name"`
	Subject                  string `json:"subject" db:"subject"`
	Year                     string `json:"year" db:"year"`
	LessonIndex              int    `json:"lesson_index" db:"lesson_index"`
	SubLessonName            string `json:"sub_lesson_name" db:"sub_lesson_name"`
	SubLessonIndex           int    `json:"sub_lesson_index" db:"sub_lesson_index"`
	IsEnabled                *bool  `json:"is_enabled" db:"is_enabled"`
	IsEnabledLevel           *bool  `json:"is_enabled_level" db:"is_enabled_level"`
}

type LevelEntity struct {
	Id            int    `json:"id" db:"id"`
	LevelIndex    int    `json:"level_index" db:"level_index"`
	LevelType     string `json:"level_type" db:"level_type"`
	QuestionType  string `json:"question_type" db:"question_type"`
	Difficulty    string `json:"difficulty" db:"difficulty"`
	QuestionCount int    `json:"question_amount" db:"question_count"`
}

type StudentEntity struct {
	Id        string     `json:"id" db:"id"`
	Title     string     `json:"title" db:"title"`
	FirstName string     `json:"first_name" db:"first_name"`
	LastName  string     `json:"last_name" db:"last_name"`
	LastLogin *time.Time `json:"last_login" db:"last_login"`
}

type LevelUnlockedForStudyGroupEntity struct {
	Id             int    `json:"id" db:"id"`
	StudyGroupName string `json:"study_group_name" db:"study_group_name"`
	Year           string `json:"year" db:"year"`
	Class          string `json:"class" db:"class"`
	StudentCount   int    `json:"student_count" db:"student_count"`
}

type LevelUnlockedForStudyGroup struct {
	LevelId      int       `db:"level_id"`
	StudyGroupId int       `db:"study_group_id"`
	CreatedAt    time.Time `db:"created_at"`
	CreatedBy    string    `db:"created_by"`
	AdminLoginAs *string   `db:"admin_login_as"`
}

type LevelUnlockedForStudent struct {
	LevelId      int       `db:"level_id"`
	StudentId    string    `db:"student_id"`
	ClassId      int       `db:"class_id"`
	CreatedAt    time.Time `db:"created_at"`
	CreatedBy    string    `db:"created_by"`
	AdminLoginAs *string   `db:"admin_login_as"`
}

type LessonUnlockedForStudent struct {
	LessonId  int    `db:"lesson_id"`
	StudentId string `db:"student_id"`
	ClassId   int    `db:"class_id"`
}

type StudyGroupEntity struct {
	Id   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

type ClassEntity struct {
	Id           int        `json:"id" db:"id"`
	Year         string     `json:"year" db:"year"`
	Name         string     `json:"name" db:"name"`
	AcademicYear *int       `json:"academic_year" db:"academic_year"`
	UpdatedAt    *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by" db:"updated_by"`
}
