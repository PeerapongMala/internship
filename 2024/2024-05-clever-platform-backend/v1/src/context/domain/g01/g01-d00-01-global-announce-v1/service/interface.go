package service

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-global-announce-v1/constant"

type ServiceInterface interface {
	GetAnnounce() ([]constant.AnnounceResponse, error)
	CreateAnnounce(constant.CreateAnnounceRequest) error
	DeleteAnnounce(constant.DeleteRequest) error
	UpdateAnnounce(constant.UpdateAnnounceRequest) error
	TeacherDailyAnnounce(constant.GetDailyAnnounceResquest) ([]constant.DailyAnnounceResponse, error)
	SystemDailyAnnounce(constant.GetDailyAnnounceResquest) ([]constant.DailyAnnounceResponse, error)
}
