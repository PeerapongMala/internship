package service

type ServiceInterface interface {
	SchoolSubjectList(in *SchoolSubjectListInput) (*SchoolSubjectListOutput, error)
	SubjectTeacherList(in *SubjectTeacherListInput) (*SubjectTeacherListOutput, error)
	SeedAcademicYearList(in *SeedAcademicYearListInput) (*SeedAcademicYearListOutput, error)
	SubjectTeacherCaseBulkEdit(in *SubjectTeacherCaseBulkEditInput) error
	SubjectTeacherCreate(in *SubjectTeacherCreateInput) error
	SchoolTeacherList(in *SchoolTeacherListInput) (*SchoolTeacherListOutput, error)
	SubjectGet(in *SubjectGetInput) (*SubjectGetOutput, error)
}
