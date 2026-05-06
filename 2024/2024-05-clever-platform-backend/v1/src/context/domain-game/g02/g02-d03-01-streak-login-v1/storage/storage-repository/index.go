package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	GetSubjectCheckin(studentId string, subjectId int) (*constant.SubjectCheckinEntity, error)
	UpdateSubjectCheckin(subjectCheckin *constant.SubjectCheckinEntity) error
	GetSubjectCheckinByAdmin(studentId string, subjectId int, adminLoginAs *string) (*constant.SubjectCheckinEntity, error)
	CreateSubjectReward(subjectReward *constant.SubjectRewardEntity) error
	UpdateSubjectReward(subjectReward *constant.SubjectRewardEntity) (*constant.SubjectRewardEntity, error)
	GetSubjectRewardBySubjectId(subjectId int) ([]constant.SubjectRewardWithItemEntity, error)
	GetInventoryByStudentId(studentId string) (*constant.InventoryEntity, error)
	UpdateInventoryByStudentId(inventory *constant.InventoryEntity) (*constant.InventoryEntity, error)

	CreateSubjectCheckIn(subjectCheckIn *constant.SubjectCheckinEntity) error
	GetSubjectRewardBySubjectIdAndDay(subjectId int, day int) (*constant.SubjectRewardEntity, error)
	UpdateCoinInventory(request *constant.InventoryDTO) (error)
	AnnouncementWithItemInsert(entity *constant.ItemToMailBoxDTO) (err error)
	UpdateInventory(tx *sqlx.Tx, input *constant.InventoryDTO) error
	InsertRewardLogs(tx *sqlx.Tx, entity *constant.RewardLogEntity) (insertId int, err error)
}
