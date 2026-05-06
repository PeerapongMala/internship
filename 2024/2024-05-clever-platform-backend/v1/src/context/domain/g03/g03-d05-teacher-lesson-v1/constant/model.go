package constant

type ClassLessonFilter struct {
	CurriculumGroupId int   `query:"curriculum_group_id"`
	SubjectId         int   `query:"subject_id"`
	IsEnabled         *bool `query:"is_enabled"`
	LessonId          int   `query:"lesson_id"`
	IsParent          *bool `query:"is_parent"`
	IsExtra           *bool `query:"is_extra"`
}

type ClassSubLessonFilter struct {
	SubjectId   int   `query:"subject_id"`
	LessonId    int   `query:"lesson_id"`
	IsEnabled   *bool `query:"is_enabled"`
	SubLessonId int   `query:"sub_lesson_id"`
}

type SubjectFilter struct {
	CurriculumGroupId int  `query:"curriculum_group_id"`
	IsParent          bool `query:"is_parent"`
}

type LessonFilter struct {
	SubjectId int `query:"subject_id"`
}

type LevelFilter struct {
	LevelType    string `query:"level_type"`
	QuestionType string `query:"question_type"`
	Difficulty   string `query:"difficulty"`
	Status       string `query:"status"`
	LevelId      int    `query:"level_id"`
	LevelIndex   int    `query:"level_index"`
}

type StudentFilter struct {
	Id        string `query:"id"`
	Title     string `query:"title"`
	FirstName string `query:"first_name"`
	LastName  string `query:"last_name"`
}

type StudyGroupFilter struct {
	Id             int    `query:"id"`
	StudyGroupName string `query:"study_group_name"`
}

type ClassFilter struct {
	TeacherId    string
	Id           int    `query:"id"`
	Year         string `query:"year"`
	Name         string `query:"name"`
	AcademicYear int    `query:"academic_year"`
	StudentId    string `query:"student_id"`
}
