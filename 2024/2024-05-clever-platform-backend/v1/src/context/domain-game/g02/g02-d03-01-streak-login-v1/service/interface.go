package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
)

type ServiceInterface interface {
	SubjectCheckinGet(studentId string, subjectId int) (*constant.SubjectCheckinEntity, error)
	SubjectCheckinUpdate(subjectCheckin *constant.SubjectCheckinEntity) error
	SubjectCheckinGetByAdmin(studentId string, subjectId int, adminLoginAs *string) (*constant.SubjectCheckinEntity, error)
	SubjectRewardCreate(subjectReward *constant.SubjectRewardEntity) error
	SubjectRewardUpdate(subjectReward *constant.SubjectRewardEntity) (*constant.SubjectRewardEntity, error)
	SubjectRewardGetBySubjectId(subjectId int) ([]constant.SubjectRewardWithItemEntity, error)
	InventoryGetByStudentId(studentId string) (*constant.InventoryEntity, error)
	InventoryUpdateByStudentId(inventory *constant.InventoryEntity) (*constant.InventoryEntity, error)
	SubjectRewardStatusGetBySubjectId(subjectId int, userId string) ([]constant.SubjectRewardWithItemEntity, error)

	GetStreakLoginStat(in *GetStreakLoginStatInput) (*constant.SubjectCheckinEntity, error)
	CheckInSendReward(in *CheckInSendRewardInput) error
	UseItem(in *UseItemInput) error
}
