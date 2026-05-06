package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-01-global-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	SystemAnnouncementList(userId string, pagination *helper.Pagination) ([]constant.AnnouncementResponse, int, error)
	TeacherAnnoucementList(userId string, pagination *helper.Pagination) ([]constant.AnnouncementResponse, int, error)
	ReadByAnnouncementId(announcementId int, userId string) error
	SystemReadAll(userId string) error
	TeacherReadAll(userId string) error
}
