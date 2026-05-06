package constant

type GetStudentGroupMembersParams struct {
	StudentGroupID *int `params:"student_group_id"`
}

type StudyGroupParams struct {
	StudyGroupID int `params:"study_group_id"`
}

type GetStudentGroupMembersSearchOption struct {
	Search       string  `query:"search"`
	AcademicYear *string `query:"academic_year"`
	Year         *string `query:"year"`
	FirstName    *string `query:"first_name"`
	LastName     *string `query:"last_name"`
	IsMember     *bool   `query:"is_member"`
}

type PatchStudentGroupMemberBulkEditBody struct {
	StudyGroupParams
	Body []PatchStudentGroupMemberBulkEditItem `json:"bulk_edit_list" validate:"dive"`
}
type PatchStudentGroupMemberBulkEditItem struct {
	StudentID string `json:"student_user_uuid" validate:"required,uuid4"`
	IsMember  bool   `json:"is_member" validate:"boolean"`
}
type StudyGroupStudent struct {
	StudyGroupID int    `json:"study_group_id"`
	StudentID    string `json:"student_user_uuid"`
}
