package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	// UserStudentCreate(student *constant.StudentEntity) (*constant.StudentEntity, error)
	// UserParentCreate(student *constant.ParentEntity) (*constant.ParentEntity, error)
	BeginTx() (*sqlx.Tx, error)

	UserCreate(tx *sqlx.Tx, user *constant.UserEntity) (*constant.UserEntity, error)
	UserGet(userId string) (*constant.UserEntity, error)
	UserUpdate(tx *sqlx.Tx, user *constant.UserEntity) (*constant.UserEntity, error)
	UserList(filter *constant.UserFilter, pagination *helper.Pagination) ([]constant.UserWithRolesEntity, error)
	UserCaseAddUserRole(tx *sqlx.Tx, userId string, roles []int) ([]int, error)
	UserCaseGetUserRole(userId string) ([]int, error)
	UserCaseUpdateUserRole(tx *sqlx.Tx, userId string, roles []int) error

	StudentCreate(tx *sqlx.Tx, student *constant.StudentEntity) (*constant.StudentEntity, error)
	StudentGet(userId string) (*constant.StudentDataEntity, error)
	StudentUpdate(tx *sqlx.Tx, student *constant.StudentEntity) (*constant.StudentEntity, error)
	StudentList(filter *constant.StudentFilter, pagination *helper.Pagination) ([]constant.StudentDataWithOAuth, error)

	AnnouncerCaseAddSchool(tx *sqlx.Tx, in *constant.SchoolAnnouncerEntity) error
	AnnouncerList(filter *constant.AnnouncerFilter, pagination *helper.Pagination) ([]constant.UserEntity, error)

	ParentCreate(tx *sqlx.Tx, parent *constant.ParentEntity) (*constant.ParentEntity, error)
	ParentList(filter *constant.UserFilter, pagination *helper.Pagination) ([]constant.ParentDataEntity, error)
	ParentUpdate(tx *sqlx.Tx, parent *constant.ParentEntity) error

	ObserverList(pagination *helper.Pagination, filter *constant.ObserverFilter) ([]constant.ObserverWithAccesses, error)
	ObserverCaseAddObserverAccess(tx *sqlx.Tx, userId string, observerAccesses []int) error
	ObserverCaseGetObserverAccesses(userId string) ([]constant.ObserverAccessEntity, error)
	ObserverCaseUpdateObserverAccesses(tx *sqlx.Tx, userId string, observerAccesses []int) error

	ObserverAccessList(filter *constant.ObserverAccessFilter, pagination *helper.Pagination) ([]constant.ObserverAccessEntity, error)

	AuthEmailPasswordCreate(tx *sqlx.Tx, auth *constant.AuthEmailPasswordEntity) (*constant.AuthEmailPasswordEntity, error)
	AuthEmailPasswordGet(userId string) (*constant.AuthEmailPasswordEntity, error)
	AuthEmailPasswordUpdate(auth *constant.AuthEmailPasswordEntity) error
	AuthOAuthCaseGetLineByUserId(userId string) (*constant.AuthOAuthEntity, error)
}
