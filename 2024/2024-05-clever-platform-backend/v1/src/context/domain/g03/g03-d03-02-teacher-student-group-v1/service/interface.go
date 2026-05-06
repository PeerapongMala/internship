package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-02-teacher-student-group-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	GetStudentGroupMembersByStudentGroupID(studentGroupID int, option constant.GetStudentGroupMembersSearchOption, pagination *helper.Pagination) ([]constant.StudentGroupMember, error)
	PatchStudentGroupMemberByID(studentGroupID int, items []constant.PatchStudentGroupMemberBulkEditItem) error
}
