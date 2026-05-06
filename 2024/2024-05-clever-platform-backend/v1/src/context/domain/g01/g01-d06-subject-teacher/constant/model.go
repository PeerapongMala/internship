package constant

type SubjectFilter struct {
	Id              int    `query:"id"`
	Name            string `query:"name"`
	CurriculumGroup string `query:"curriculum_group"`
	Year            string `query:"year"`
	ContractName    string `query:"contract_name"`
	ContractStatus  string `query:"contract_status"`
}

type SubjectTeacherFilter struct {
	Id           string `query:"id"`
	AcademicYear int    `query:"academic_year"`
	Title        string `query:"title"`
	FirstName    string `query:"first_name"`
	LastName     string `query:"last_name"`
	Email        string `query:"email"`
}

type SchoolTeacherFilter struct {
	Id        string `query:"id"`
	Title     string `query:"title"`
	FirstName string `query:"first_name"`
	LastName  string `query:"last_name"`
}

type SubjectTeacherBulkEditItem struct {
	TeacherId    string `json:"teacher_id" validate:"required"`
	AcademicYear int    `json:"academic_year" validate:"required"`
}
