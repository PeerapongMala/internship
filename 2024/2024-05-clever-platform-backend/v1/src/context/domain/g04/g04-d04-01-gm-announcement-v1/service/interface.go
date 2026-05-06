package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	GetGlobalAnnounce(pagination *helper.Pagination, filter constant.SystemAnnounceFilter, Role constant.CheckRoleRequest) ([]constant.GlobalAnnounceResponse, int, error)
	GetEventAnnounce(pagination *helper.Pagination, filter constant.EventAnnounceFilter, Role constant.CheckRoleRequest) ([]constant.EventAnnounceResponse, int, error)
	GetRewardAnnounce(pagination *helper.Pagination, filter constant.RewardAnnounceFilter, Role constant.CheckRoleRequest) ([]constant.RewardAnnounceResponseService, int, error)
	GetNewsAnnounce(pagination *helper.Pagination, filter constant.NewsAnnounceFilter, Role constant.CheckRoleRequest) ([]constant.NewsAnnounceResponse, int, error)
	AddGlobalAnnounce(c constant.CreateGlobalAnnounceRequest, Role constant.CheckRoleRequest) error
	AddEventAnnounce(c constant.CreateEventAnnounceRequest, Role constant.CheckRoleRequest) error
	AddRewardAnnounce(c constant.CreateRewardAnnounceRequestService, Role constant.CheckRoleRequest) error
	AddNewsAnnounce(c constant.CreateNewsAnnounceRequest, Role constant.CheckRoleRequest) error
	UpdateGlobalAnnounce(c constant.UpdateGlobalAnnounceRequest, Role constant.CheckRoleRequest) error
	UpdateEventAnnounce(c constant.UpdateEventAnnounceRequest, Role constant.CheckRoleRequest) error
	UpdateRewardAnnounce(c constant.UpdateRewardAnnounceRequestService, Role constant.CheckRoleRequest) error
	UpdateNewsAnnounce(c constant.UpdateNewsAnnounceRequest, Role constant.CheckRoleRequest) error
	GetGlobalAnnounceById(AnnounceId int, Role constant.CheckRoleRequest) (*constant.GlobalAnnounceResponse, error)
	GetEventAnnounceById(AnnounceId int, Role constant.CheckRoleRequest) (*constant.EventAnnounceResponse, error)
	GetNewsAnnounceById(AnnounceId int, Role constant.CheckRoleRequest) (*constant.NewsAnnounceResponse, error)
	GetRewardAnnounceById(AnnounceId int, Role constant.CheckRoleRequest) (*constant.RewardAnnounceResponseService, error)
	DeleteAnnouncementItem(announceId int, ItemId int) error

	GlobalAnnounceCsvDownload(req constant.CsvDowloadRequest, filter constant.SystemAnnounceFilter, Role constant.CheckRoleRequest, pagination *helper.Pagination) ([]byte, error)
	EventAnnounceCsvDownload(req constant.CsvDowloadRequest, filter constant.EventAnnounceFilter, Role constant.CheckRoleRequest, pagination *helper.Pagination) ([]byte, error)
	RewardAnnounceCsvDownload(req constant.CsvDowloadRequest, filter constant.RewardAnnounceFilter, Role constant.CheckRoleRequest, pagination *helper.Pagination) ([]byte, error)
	NewsAnnounceCsvDownload(req constant.CsvDowloadRequest, filter constant.NewsAnnounceFilter, Role constant.CheckRoleRequest, pagination *helper.Pagination) ([]byte, error)

	GlobalAnnounceCsvUpload(req constant.CSVUploadRequest, Role constant.CheckRoleRequest) error
	EventAnnounceCsvUpload(req constant.CSVUploadRequest, Role constant.CheckRoleRequest) error
	RewardAnnounceCsvUpload(req constant.CSVUploadRequest, Role constant.CheckRoleRequest) error
	NewsAnnounceCsvUpload(req constant.CSVUploadRequest, Role constant.CheckRoleRequest) error

	GlobalAnnounceBulkEdit(req []constant.AnnounceBulkEdit, Role constant.CheckRoleRequest) error
	EventAnnounceBulkEdit(req []constant.AnnounceBulkEdit, Role constant.CheckRoleRequest) error
	RewardAnnounceBulkEdit(req []constant.AnnounceBulkEdit, Role constant.CheckRoleRequest) error
	NewsAnnounceBulkEdit(req []constant.AnnounceBulkEdit, Role constant.CheckRoleRequest) error

	SchoolList(pagination *helper.Pagination) ([]constant.SchoolList, int, error)
	YearList(pagination *helper.Pagination, filter constant.YearFilter) ([]constant.YearList, int, error)
	SubjectList(pagination *helper.Pagination, filter constant.SubjectFilter) ([]constant.SubjectList, int, error)
	AcademicYearList(pagination *helper.Pagination) ([]constant.AcademicYearResponse, int, error)
	ArcadeGameList(pagination *helper.Pagination) ([]constant.ArcadeGameList, int, error)
	ItemDropDown(pagination *helper.Pagination, req constant.ItemDropDownRequest) ([]constant.ItemListDropDown, int, error)
	UpdateCoinAmount(req constant.CoinDelete, announceId int) error
	SchoolAcademicYear(schoolId int, pagination *helper.Pagination) ([]constant.AcademicYearResponse, error)
}
