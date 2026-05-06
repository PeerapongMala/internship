package constant

type GetStudyGroupListFilter struct {
	AcademicYear   int    `query:"academic_year"`
	TeacherID      string `query:"teacher_id"`
	SchoolID       int    `params:"school_id" validate:"required"`
	Status         Status `query:"status"`
	Year           string `query:"year"`
	SubjectID      int    `query:"subject_id"`
	Class          string `query:"class"`
	StudyGroupName string `query:"study_group_name"`
	ClassId        int    `query:"class_id"`
}

type GetStudentGroupListRequest struct {
	SchoolIDParams
	AcademicYear   int    `query:"academicYear" validate:"omitempty"`
	Class          string `query:"class" validate:"omitempty"`
	Status         Status `query:"status" validate:"omitempty"`
	Year           string `query:"year" validate:"omitempty"`
	SubjectID      int    `query:"subject" validate:"omitempty"`
	StudyGroupName string `query:"study_group_name" validate:"omitempty"`
	ClassId        int    `query:"class_id"`
}

type UpdateStudyGroupsStatusItem struct {
	ID     int    `json:"id" validate:"required"`
	Status Status `json:"status" validate:"required"`
}
type UpdateStudyGroupsStatusRequest struct {
	Items []UpdateStudyGroupsStatusItem `json:"bulk_edit_list" validate:"dive"`
}
