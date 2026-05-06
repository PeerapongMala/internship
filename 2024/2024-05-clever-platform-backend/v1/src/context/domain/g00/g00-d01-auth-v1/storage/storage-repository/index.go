package storageRepository

import (
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	AuthCaseAddUserAuthEmailPassword(tx *sqlx.Tx, auth *constant2.AuthEmailPasswordEntity) error
	AuthCaseAddUserAuthOAuth(tx *sqlx.Tx, auth *constant2.AuthOAuthEntity) error
	AuthCaseLoginWithOAuth(subjectId string) (*string, error)
	AuthCaseBindAccountWithOAuth(provider, userId, subjectId string) error
	AuthCaseAddStudentAuthPin(tx *sqlx.Tx, userId, pin string) error
	AuthCaseLoginWithPin(userId string) (*string, error)
	AuthCaseGetUserOAuth(userId string) ([]constant2.AuthOAuthEntity, error)
	AuthCaseUnbindOAuth(userId, provider string) error
	AuthCaseUpdatePassword(userId, passwordHash string) error
	AuthCaseUpdatePin(userId, pin string) error

	ObserverAccessCreate(tx *sqlx.Tx, in *constant2.ObserverAccessEntity) (*constant2.ObserverAccessEntity, error)
	ObserverAccessCaseAddSchool(tx *sqlx.Tx, observerAccessId int, schools []int) ([]int, error)
	ObserverAccessList(filter *constant2.ObserverAccessFilter, pagination *helper.Pagination) ([]constant2.ObserverAccessWithSchoolsEntity, error)
}
