package service

type ServiceInterface interface {
	GlobalZoneSelectSubjectGet(userId string) (*selectSubjectResponse, error)
	AnnouncementGet(in *AnnouncementRequest) (*AnnouncementResponse, error)
	AnnouncementUpdateStatus(in *AnnouncementUpdateStatusRequest) (error)
}
