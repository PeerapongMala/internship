package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d07-academic-profile-v1/constant"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	UserGet(userId string) (*constant.UserEntity, error)
	UserUpdate(tx *sqlx.Tx, user *constant.UserEntity) (*constant.UserEntity, error)
	AuthCaseUpdatePassword(userId, passwordHash string) error
}
