package constant

type HomeWorkTemplateListFilter struct {
	Search               string `query:"search"`
	YearName             string `query:"year_short_name"`
	SubjectName          string `query:"subject_name"`
	LessonName           string `query:"lesson_name"`
	Status               string `query:"status"`
	HomeworkTemplateName string `query:"homework_template_name"`
}

type HomeWorkListFilter struct {
	Search         string `query:"search"`
	LessonName     string `query:"lesson_name"`
	StartedAtStart string `query:"started_at_start"`
	StartedAtEnd   string `query:"started_at_end"`
	DueAtStart     string `query:"due_at_start"`
	DueAtEnd       string `query:"due_at_end"`
	CloseAtStart   string `query:"close_at_start"`
	CloseAtEnd     string `query:"close_at_end"`
	YearId         int    `query:"year_id"`
	ClassId        int    `query:"class_id"`
	StudyGroupId   int    `query:"study_group_id"`
	HomeworkType   string `query:"homework_type"`
	HomeworkName   string `query:"homework_name"`
}

type SubjectListFilter struct {
	SubjectId int    `query:"subject_id"`
	YearName  string `query:"year_name"`
}

type HomeworkSubmitDetailListFilter struct {
	Search   string `query:"search"`
	Status   string `query:"status"`
	SchoolId int    `query:"school_id"`
}
