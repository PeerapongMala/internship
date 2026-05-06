package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-00-teacher-student-group-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	GetStudyGroupList(filter *constant.GetStudyGroupListFilter, pagination *helper.Pagination) ([]constant.StudentGroupResult, error)
	PatchStudentGroupsStatus(teacherId string, items []constant.UpdateStudyGroupsStatusItem) error
}
