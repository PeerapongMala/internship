package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type GmAnnounceRepository interface {
	GetGlobalAnnounce(pagination *helper.Pagination, filter constant.SystemAnnounceFilter) ([]constant.GlobalAnnounceResponse, int, error)
	GetEventAnnounce(pagination *helper.Pagination, filter constant.EventAnnounceFilter) ([]constant.EventAnnounceResponse, int, error)
	GetRewardAnnounce(pagination *helper.Pagination, filter constant.RewardAnnounceFilter) ([]constant.RewardAnnounceResponseService, int, error)
	GetNewsAnnounce(pagination *helper.Pagination, filter constant.NewsAnnounceFilter) ([]constant.NewsAnnounceResponse, int, error)
	AddGlobalAnnounce(c constant.CreateGlobalAnnounceRequest) (int, error)
	AddEventAnnounce(c constant.CreateEventAnnounceRequest) error
	AddRewardAnnounce(c constant.CreateRewardAnnounceRequest) (int, error)
	AddNewsAnnounce(c constant.CreateNewsAnnounceRequest) error
	UpdateGlobalAnnounce(c constant.UpdateGlobalAnnounceRequest) error
	UpdateEventAnnounce(c constant.UpdateEventAnnounceRequest) error
	UpdateRewardAnnounce(c constant.UpdateRewardAnnounceRequest) error
	UpdateNewsAnnounce(c constant.UpdateNewsAnnounceRequest) error
	GetGlobalAnnounceById(AnnounceId int) (*constant.GlobalAnnounceResponse, error)
	GetEventAnnounceById(AnnounceId int) (*constant.EventAnnounceResponse, error)
	GetRewardAnnounceById(AnnounceId int) (*constant.RewardAnnounceResponseService, error)
	GetNewsAnnounceById(AnnounceId int) (*constant.NewsAnnounceResponse, error)
	AddRewardItem(c constant.AddRewardItemRequest) error
	UpdateRewardItem(c constant.UpdateRewardItemRequest) error
	AddRewardCoinItem(req constant.AddRewardCoinRequest) error
	UpdateRewardCoinItem(req constant.UpdateRewardCoinRequest) error
	AnnouncementItemList(announceId int) ([]constant.ItemList, error)
	DeleteAnnouncementItem(announceId int, ItemId int) error

	ArcadeGameList(pagination *helper.Pagination) ([]constant.ArcadeGameList, int, error)

	GlobalAnnounceBulkEdit(req constant.AnnounceBulkEdit, c constant.User) error
	EventAnnounceBulkEdit(req constant.AnnounceBulkEdit, c constant.User) error
	RewardAnnounceBulkEdit(req constant.AnnounceBulkEdit, c constant.User) error
	NewsAnnounceBulkEdit(req constant.AnnounceBulkEdit, c constant.User) error
	ItemList(announceId int) ([]constant.ItemList, error)
	CoinList(announceId int) (*constant.CoinList, error)
	//DropDown

	SchoolList(pagination *helper.Pagination) ([]constant.SchoolList, int, error)
	YearList(pagination *helper.Pagination, filter constant.YearFilter) ([]constant.YearList, int, error)
	SubjectList(pagination *helper.Pagination, filter constant.SubjectFilter) ([]constant.SubjectList, int, error)
	AcademicYearList(pagination *helper.Pagination) ([]constant.AcademicYearResponse, int, error)
	ItemDropDown(pagination *helper.Pagination, req constant.ItemDropDownRequest) ([]constant.ItemListDropDown, int, error)
	SchoolItemDropDown(pagination *helper.Pagination, req constant.ItemDropDownRequest) ([]constant.ItemListDropDown, int, error)
	CheckCoinExist(announceId int) (bool, error)
	UpdateCoinAmount(req constant.CoinDelete, announceId int) error
	DeleteCoinReward(announceId int) error
	SchoolAcademicYear(schoolId int, pagition *helper.Pagination) ([]constant.AcademicYearResponse, error)
}
