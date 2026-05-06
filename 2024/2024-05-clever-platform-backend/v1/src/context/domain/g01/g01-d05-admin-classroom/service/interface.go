package service

type ServiceInterface interface {
	ClassroomCreate(in *ClassroomCreateInput) (*ClassroomCreateOutput, error)
	ClassroomUpdate(in *ClassroomUpdateInput) (*ClassroomUpdateOutput, error)
	ClassroomList(in *ClassroomListInput) (*ClassroomListOutput, error)
	ClassroomBulkUpdate(in *ClassroomBulkUpdateInput) (*ClassroomBulkUpdateOutput, error)
	ClassroomClone(in *ClassroomCloneInput) (*ClassroomCloneOutput, error)
	ClassroomDownloadCSV(in *ClassroomDownloadCSVInput) (*ClassroomDownloadCSVOutput, error)
	ClassroomUploadCSV(in *ClassroomUploadCSVInput) (*ClassroomUploadCSVOutput, error)
	ClassroomGet(in *ClassroomGetInput) (*ClassroomGetOutput, error)
	ClassroomAcademicYearGet(in *ClassroomAcademicYearGetInput) (*ClassroomAcademicYearGetOutput, error)
	ClassroomYearGet(in *ClassroomYearGetInput) (*ClassroomYearGetOutput, error)

	TeacherSchoolList(in *TeacherListInput) (*TeacherListOutput, error)
	TeacherCreate(in *TeacherCreateInput) error
	TeacherBulkUpdate(in *TeacherBulkUpdateInput) error
	TeacherClassroomList(in *TeacherClassroomListInput) (*TeacherClassroomListOutput, error)
	TeacherDownloadCSV(in *TeacherDownloadCSVInput) (*TeacherDownloadCSVOutput, error)
	TeacherDelete(in *TeacherDeleteInput) error

	StudentSchoolList(in *StudentListInput) (*StudentListOutput, error)
	StudentBulkUpdate(in *StudentBulkUpdateInput) error
	StudentCreate(in *StudentCreateInput) error
	StudentClassroomList(in *StudentClassroomListInput) (*StudentClassroomListOutput, error)
	StudentDownloadCSV(in *StudentDownloadCSVInput) (*StudentDownloadCSVOutput, error)
	StudentDelete(in *StudentDeleteInput) error
	StudentMove(in *StudentMoveInput) error
	ClassroomCaseMoveStudentCsv(in *ClassroomCaseMoveStudentCsvInput) (*ClassroomCaseMoveStudentCsvOutput, error)
}
