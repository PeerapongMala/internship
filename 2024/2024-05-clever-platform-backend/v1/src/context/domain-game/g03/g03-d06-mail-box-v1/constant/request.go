package constant

type AnnouncementListRequest struct {
	UserId    string
	SchoolId  int
	SubjectId int
}

type AnnouncementFilterRequest struct {
	UserId         string
	AnnouncementId int
}
type AnnouncementReadRequest struct {
	UserId         string
	AnnouncementId int
}

type AnnouncementDeleteRequest struct {
	UserId         string
	AnnouncementId int
}

type ItemReceivedRequest struct {
	ItemId      int
	Amount      int
	InventoryId int
}
type RewardLogRequest struct {
	UserId           string
	GoldCoinAmount   *int
	ArcadeCoinAmount *int
	IceAmount        *int
	ItemId           *int
	ItemAmount       *int
}

type TeacherRewardRequest struct {
	SubjectId int
	StudentId string
}
type ReceivedRequest struct {
	RewardId  int
	StudentId string
}
