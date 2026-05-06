package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type MailBoxRepository interface {
	EventAnnounceList(req constant.AnnouncementListRequest, pagination *helper.Pagination) ([]constant.EventAnnounceResponse, int, error)
	RewardAnnounceList(req constant.AnnouncementListRequest, pagination *helper.Pagination) ([]constant.RewardAnnounceResponse, int, error)
	SystemAnnounceList(req constant.AnnouncementListRequest, pagination *helper.Pagination) ([]constant.SystemAnnouncement, int, error)
	AnnouncementFilter(req constant.AnnouncementFilterRequest) (bool, error)
	GetSchoolByStudentId(studentId string) (int, error)
	AnnouncementRead(req constant.AnnouncementReadRequest) error
	UpdateDelete(req constant.AnnouncementDeleteRequest) error
	GetAnnouncementType(announceId int) (string, error)
	CheckRead(announceId int, UserId string) (bool, error)
	CheckReceived(announceId int, UserId string) (bool, error)
	GetinventoryId(UserId string) (int, error)
	ItemReceived(req constant.ItemReceivedRequest) error
	UserAnnouncementReceived(announceId int, UserId string) error
	GetItemInfoByAnnouncementId(announceId int) ([]constant.ItemInfo, error)
	GetCoinInfoByAnnouncementId(announceId int) (*constant.CoinInfo, error)
	CheckCoinExist(announceId int) (bool, error)
	RewardLogCreate(req constant.RewardLogRequest) error
	GetUserCoin(userId string) (*constant.CoinInfo, error)
	UserInventoryUpdate(userId string, req constant.CoinInfo) error
	RewardItemList(announceId int) ([]constant.ItemList, error)
	CheckItemInventoryExist(inventoryId int, itemId int) (bool, error)
	GetInventoryItemAmountById(inventoryId int, itemId int) (int, error)
	UpdateUserItemAmount(inventoryId int, amount int, itemId int) error
	CheckItemExist(announceId int) (bool, error)
	CheckItemReceived(announceId int, UserId string) (bool, error)
	TeacherRewardList(req constant.TeacherRewardRequest, pagination *helper.Pagination) ([]constant.TeacherRewardResponse, error)
	TeacherRewardReceived(req constant.ReceivedRequest) error
	GetItemIdByRewardId(rewardId int) (int, error)
	GetRewardItemAmount(rewardId int) (int, error)
	RewardDelete(rewardId int) error
	CheckTeacherRewardReceived(rewardId int) (bool, error)
}
