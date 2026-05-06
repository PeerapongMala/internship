package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d01-information-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	MainManuAccountInventoryGet(userId string, subjectId int) (*AccountInventoryResponse, error)
	SubjectCheckinCountGet(userId string, subjectId int) (*SubjectCheckinCountResponse, error)
	UnreadAnouncementCountCountGet(userId string) (*UnreadAnouncementCountResponse, error)
	AnouncementList(in *AnnouncementRequest, pagination *helper.Pagination) ([]*constant.AnnouncementList, error)
	GetInventoryProfile(userId string) (*constant.InventoryProfile, error)
	GetAccount(userID string) (*constant.Account, error)
}
