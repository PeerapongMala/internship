package storageRepository

import (
	"time"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d06-academic-translation-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	SavedTextCreate(tx *sqlx.Tx, savedText *constant.SavedTextEntity) (*constant.SavedTextEntity, error)
	SavedTextGet(groupId string) (*constant.SavedTextDataEntity, error)
	SavedTextUpdate(tx *sqlx.Tx, savedText *constant.SavedTextUpdateEntity) (*constant.SavedTextEntity, error)
	SavedTextList(curriculumGroupId int, filter *constant.SavedTextFilter, pagination *helper.Pagination) ([]constant.SavedTextListDataEntity, error)
	SavedTextCaseGetByGroupLanguage(groupId string, language string) (*constant.SavedTextEntity, error)
	SavedTextCaseGetByGroupId(groupId string) (*constant.SavedTextDataEntity, error)
	SavedTextCaseDeleteSpeech(tx *sqlx.Tx, savedTextId int) error

	CurriculumGroupCaseListContentCreator(curriculumGroupId int) ([]userConstant.UserEntity, error)
	SavedTextCaseListByDate(curriculumGroupId int, startDate *time.Time, endDate *time.Time) ([]constant.SavedTextEntity, error)
}
