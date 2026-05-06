package storageRepository

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-01-teacher-student-group-v1/constant"

type Repository interface {
	InsertStudyGroup(data *constant.InsertStudyGroup) error
	UpdateStudyGroup(data *constant.UpdateStudyGroup) error
	GetStudyGroupById(id int, teacherID string) (*constant.GetStudyGroupByIDResponse, error)
	CheckStudyGroupAccess(studentGroupID int, userID string) (bool, error)
	CheckStudyGroupExist(studentGroupID int) (bool, error)
	CheckStudyGroupByClassID(classID int, teacherID string) (bool, error)
}
