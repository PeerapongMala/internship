package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	EventAnnounceList(req constant.AnnouncementListRequest, pagination *helper.Pagination) ([]constant.EventAnnounceResponse, int, error)
	RewardAnnounceList(req constant.AnnouncementListRequest, pagination *helper.Pagination) ([]constant.RewardAnnounceResponse, int, error)
	SystemAnnounceList(req constant.AnnouncementListRequest, pagination *helper.Pagination) ([]constant.SystemAnnouncement, int, error)
	AnnouncementRead(req constant.AnnouncementReadRequest) error
	UpdateDelete(req constant.AnnouncementDeleteRequest) error
	ItemReceived(userId string, announcementId int) error
	RewardAnnouncementBulkEdit(userId string, subjectId int) error
	SystemAnnouncementBulkEdit(userId string, subjectId int) error
	EventReadAll(userId string, subjecId int) error
	SystemReadAll(userId string, subjecId int) error
	RewardReadReceivedAll(userId string, subjectId int) error
	TeacherRewardList(req constant.TeacherRewardRequest, pagination *helper.Pagination) ([]constant.TeacherRewardResponse, error)
	TeacherRewardReceived(req constant.ReceivedRequest) error
	RewardDelete(rewardId int) error
	RewardReceivedAll(subjectId int, studentId string) error
	RewardDeleteAll(subjectId int, studentId string) error
}
