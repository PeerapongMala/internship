package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-01-global-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type GlobalAnnounceRepository interface {
	SystemAnnouncementList(schoolId int, pagination *helper.Pagination) ([]constant.AnnouncementResponse, int, error)
	TeacherAnnoucementList(schoolId int, pagination *helper.Pagination) ([]constant.AnnouncementResponse, int, error)
	GetSchoolIdByStudentId(studentId string) (int, error)
	ReadByAnnouncementId(announcementId int, userId string) error
	CheckRead(announcementId int, userId string) (bool, error)
}
