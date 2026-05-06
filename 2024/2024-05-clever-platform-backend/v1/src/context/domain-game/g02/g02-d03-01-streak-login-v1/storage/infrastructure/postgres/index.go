package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/storage/storage-repository"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/jmoiron/sqlx"
)

type postgresRepository struct {
	Database *sqlx.DB
}

type CheckinRepositoryInterface interface {
	GetSubjectCheckin(studentId string, subjectId int) (*constant.SubjectCheckinEntity, error)
	UpdateSubjectCheckin(subjectCheckin *constant.SubjectCheckinEntity) error
	GetSubjectCheckinByAdmin(studentId string, subjectId int, adminLoginAs *string) (*constant.SubjectCheckinEntity, error)
	CreateSubjectReward(subjectReward *constant.SubjectRewardEntity) error
	UpdateSubjectReward(subjectReward *constant.SubjectRewardEntity) (*constant.SubjectRewardEntity, error)
	GetSubjectRewardBySubjectId(subjectId int) ([]*constant.SubjectRewardEntity, error)
	GetInventoryByStudentId(studentId string) (*constant.InventoryEntity, error)
	UpdateInventoryByStudentId(inventory *constant.InventoryEntity) (*constant.InventoryEntity, error)
}

type CheckinRepository struct {
	Db *sqlx.DB
}

func NewCheckinRepository(db *sqlx.DB) *CheckinRepository {
	return &CheckinRepository{Db: db}
}

func RepositoryNew(resource coreInterface.Resource) storageRepository.Repository {
	return &postgresRepository{
		Database: resource.PostgresDatabase,
	}
}
