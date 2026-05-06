package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-global-zone-v1/constant"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	// SQL Utils
	BeginTx() (*sqlx.Tx, error)

	GetSubjectsBySchoolId(userId string) ([]constant.SubjectResponse, error)
	GetSchoolByStudentId(studentId string) (int, error)
	GetAnnouncementGlobalZone(schoolId int, userId string, announcementType string) ([]constant.AnnouncementEntity, error)
	InsertUserAnnouncement(entity *constant.UserAnnouncementEntity) error
	UpdateUserAnnouncement(entity *constant.UserAnnouncementEntity) error
}
