package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d12-teacher-profile-v1/constant"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	UserGet(userId string) (*constant.UserEntity, error)
	AuthCaseUpdatePassword(userId, passwordHash string) error
	UserUpdate(tx *sqlx.Tx, user *constant.UserEntity) (*constant.UserEntity, error)
	AuthOauthCaseGetByUserId(userId string) ([]constant.AuthOauthEntity, error)
	UserCaseDeleteOauth(userId string, provider string) error
}
