package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	FamilyList(filter *constant.FamilyFilter, pagination *helper.Pagination) ([]*constant.FamilyResponse, error)
	FamilyGetInfo(familyID int) (*constant.FamilyResponse, error)
	FamilyMember(familyID int) ([]*constant.Member, error)
	FamilyUpdateStatus(family *constant.Family) error
	FamilyDownloadCSV(filter *constant.FamilyFilter) ([]byte, error)
	FamilyBulkEdit(familyIDs []int) error
	FamilyDelete(familyID int) error
	ValidatePassword(userID, password string) (bool, error)

	UpdateFamilyOwner(req *ChangeOwner) error
	DeleteMember(req *DeleteMember) error
	AddFamily(family *FamilyRequest) error
	AddMember(members *AddMemberRequest) error
	UserBulkEdit(req *UserBulkEditRequest) error

	MemberList(filter *constant.UserFilter, pagination *helper.Pagination) (interface{}, error)
	ParentList(search string, pagination *helper.Pagination) ([]*constant.Parent, error)
	StudentList(filter *constant.StudentFilter, pagination *helper.Pagination) ([]*constant.Student, error)

	SchoolList(*helper.Pagination) ([]*constant.SchoolList, error)
	AcademicYearList(*helper.Pagination, int) ([]*int, error)
	YearList(filter *constant.DropdownFilter, pagination *helper.Pagination) ([]*string, error)
	ClassList(filter *constant.DropdownFilter, pagination *helper.Pagination) ([]*constant.ClassList, error)
}
