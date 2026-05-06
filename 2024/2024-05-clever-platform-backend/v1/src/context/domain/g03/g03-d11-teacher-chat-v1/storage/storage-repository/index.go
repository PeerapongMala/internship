package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type RepositoryTeacherChat interface {
	BeginTx() (*sqlx.Tx, error)
	SaveMessage(message *constant.Message) (*constant.Message, error)
	ChatHistoryList(in *constant.ListInput) ([]*constant.MessageList, error)
	ChatListTeacher(filter *constant.ChatFilter, pagination *helper.Pagination) ([]*constant.ChatListTeacher, error)
	ChatListStudent(filter *constant.ChatFilter, pagination *helper.Pagination) ([]*constant.ChatListStudent, error)
	ValidatePrivilegeStudent(req *constant.ValidateRequest) (bool, error)
	ValidatePrivilegeTeacher(req *constant.ValidateRequest) (bool, error)
	GetInformationSender(userID string) (*constant.MessageList, error)
	ClassListStudent(classId, academicYear int, searchText string, pagination *helper.Pagination) ([]constant.Member, error)
	GroupListStudent(studyGroupId, academicYear int, searchText string, pagination *helper.Pagination) ([]constant.Member, error)
	SubjectListStudent(subjectId, academicYear int, schoolId int, searchText string, pagination *helper.Pagination) ([]constant.Member, error)
	InitMessage(filter *constant.Message) (*string, error)
	FindAllUsersByFilter(schoolID int, roomType string, roomID string) ([]*string, error)
	// SaveMultipleMessage(tx *sqlx.Tx, message *constant.Message) error
}
