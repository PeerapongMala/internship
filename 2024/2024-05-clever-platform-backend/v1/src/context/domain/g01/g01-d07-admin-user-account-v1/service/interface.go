package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	UserCreate(*UserCreateInput) (*UserCreateOutput, error)
	UserGet(userId string) (*constant.UserEntity, []int, error)
	UserUpdate(*UserUpdateInput) (*UserUpdateOutput, error)
	UserList(filter *constant.UserFilter, pagination *helper.Pagination) ([]constant.UserWithRolesEntity, error)
	UserCaseUpdateRoles(in *UserCaseUpdateRolesInput) (*UserCaseUpdateRolesOutput, error)
	UserCaseBulkEdit(in *UserCaseBulkEditInput) error

	// StudentCreate(*StudentCreateInput) (*StudentCreateOutput, error)
	StudentGet(userId string) (*constant.StudentDataEntity, error)
	StudentUpdate(in *StudentUpdateInput) (*StudentUpdateOutput, error)
	StudentList(filter *constant.StudentFilter, pagination *helper.Pagination) ([]constant.StudentDataWithOAuth, error)

	// AnnouncerCreate(*AnnouncerCreateInput) (*AnnouncerCreateOutput, error)
	AnnouncerList(filter *constant.AnnouncerFilter, pagination *helper.Pagination) ([]constant.UserEntity, error)

	// ParentCreate(*ParentCreateInput) (*ParentCreateOutput, error)
	ParentGet(*ParentGetInput) (*ParentGetOutput, error)
	ParentList(filter *constant.UserFilter, pagination *helper.Pagination) ([]constant.ParentDataEntity, error)

	ObserverCreate(*ObserverCreateInput) (*ObserverCreateOutput, error)
	ObserverGet(*ObserverGetInput) (*ObserverGetOutput, error)
	ObserverList(*ObserverListInput) (*ObserverListOutput, error)
	ObserverCaseUpdateObserverAccesses(*ObserverCaseUpdateObserverAccessesInput) (*ObserverCaseUpdateObserverAccessesOutput, error)

	ObserverAccessList(in *ObserverAccessListInput) (*ObserverAccessListOutput, error)

	AuthEmailPasswordUpdate(in *AuthEmailPasswordUpdateInput) error

	AdminUploadCSV(req *constant.UploadCSVInput) error
	ParentUploadCSV(req *constant.UploadCSVInput) error
	ObserverUploadCSV(req *constant.UploadCSVInput) error
	ContentCreatorUploadCSV(req *constant.UploadCSVInput) error

	AdminDownloadCSV(in *constant.DownloadCSVInput) ([]byte, error)
	ParentDownloadCSV(in *constant.DownloadCSVInput) ([]byte, error)
	ObserverDownloadCSV(in *constant.DownloadCSVInput) ([]byte, error)
	ContentCreatorDownloadCSV(in *constant.DownloadCSVInput) ([]byte, error)
}
