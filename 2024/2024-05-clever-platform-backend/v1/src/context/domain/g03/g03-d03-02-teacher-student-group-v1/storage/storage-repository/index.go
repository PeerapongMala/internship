package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-02-teacher-student-group-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type Repository interface {
	GetStudentGroupMembersByStudentGroupID(studyGroup constant.StudyGroup, option *constant.GetStudentGroupMembersSearchOption, pagination *helper.Pagination) ([]constant.StudentGroupMember, error)
	DeleteStudyGroupMemberByID(items []constant.StudyGroupStudent) error
	InsertMemberToStudyGroupByID(items []constant.StudyGroupStudent) error
	StudyGroupGet(studyGroupId int) (*constant.StudyGroup, error)
	StudyGroupStudentCheck(classId, subjectId int, userId string) (bool, error)
}
