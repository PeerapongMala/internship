package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d01-information-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type Repository interface {
	GetInventoryInfoByUserId(userId string) (*constant.InventoryEntity, error)
	GetSubjectCheckinCountById(userId string, subjectId int) (int, error)
	GetUnreadAnnouncementCountByUserId(userId string) (int, error)
	AnouncementList(schoolID int, userID string, pagination *helper.Pagination) ([]*constant.AnnouncementList, error)
	GetInventoryProfile(userId string) (*constant.InventoryProfile, error)
	GetAccount(userId string) (*constant.Account, error)
	GetStars(userId string, subjectId int) (*int, error)
}
