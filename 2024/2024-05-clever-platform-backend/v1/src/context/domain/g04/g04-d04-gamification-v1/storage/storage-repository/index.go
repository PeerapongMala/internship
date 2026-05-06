package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)
	LevelRewardList(filter *constant.LevelRewardFilter, pagination *helper.Pagination) ([]constant.LevelRewardEntity, error)
	SeedSubjectGroupList(pagination *helper.Pagination) ([]constant.SeedSubjectGroupEntity, error)
	LevelList(filter *constant.LevelFilter, pagination *helper.Pagination) ([]constant.LevelEntity, error)
	SubjectList(filter *constant.SubjectFilter, pagination *helper.Pagination) ([]constant.SubjectEntity, error)
	LessonList(filter *constant.LessonFilter, pagination *helper.Pagination) ([]constant.LessonEntity, error)
	SubLessonList(filter *constant.SubLessonFilter, pagination *helper.Pagination) ([]constant.SubLessonEntity, error)
	ItemList(filter *constant.ItemFilter, pagination *helper.Pagination) ([]constant.ItemEntity, error)
	LevelSpecialRewardCreate(tx *sqlx.Tx, levelSpecialReward *constant.LevelSpecialRewardEntity) error
	LevelCaseGetStatus(levelId int) (*string, error)
	LevelUpdate(tx *sqlx.Tx, level *constant.LevelEntity) error
	LevelSpecialRewardItemList(filter *constant.LevelSpecialRewardItemFilter, pagination *helper.Pagination) ([]constant.LevelSpecialRewardItemEntity, error)
	LevelSpecialRewardDelete(tx *sqlx.Tx, levelSpecialRewardId int, levelId int) error
	LevelSpecialRewardItemUpdate(tx *sqlx.Tx, levelSpecialRewardItemId int, amount int, levelId int) error
	LevelDataGet(levelId int) (*constant.LevelDataEntity, error)
}
