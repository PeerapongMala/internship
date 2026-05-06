package constant

type TeacherItemFilter struct {
	SubjectId   int    `params:"subjectId" validate:"required"`
	Type        string `query:"type"`
	Status      string `query:"status"`
	Id          string `query:"id"`
	Name        string `query:"name"`
	Description string `query:"description"`
	SchoolId    int    `query:"school_id"`
	TeacherId   string `query:"teacher_id"`
}

type TeacherItemGroupFilter struct {
	Id int `query:"id"`
}
