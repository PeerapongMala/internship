package storagerepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	FamilyList(filter *constant.FamilyFilter, pagination *helper.Pagination) ([]*constant.FamilyResponse, error)
	FamilyGet(family_id int) (*constant.FamilyResponse, error)
	FamilyMember(familyID int) ([]*constant.Member, error)
	FamilyArchive(tx *sqlx.Tx, family *constant.Family) error
	FamilyDelete(tx *sqlx.Tx, familyID int) error
	AuthPasswordGetByUserId(userID string) (*string, error)

	UpdateFamilyOwner(tx *sqlx.Tx, userID string, familyID int) error

	DeleteMember(tx *sqlx.Tx, family_id int, userID string) error
	AddMember(tx *sqlx.Tx, familyID int, usersID string, owner bool) error
	AddFamily(tx *sqlx.Tx, family *constant.Family) (int, error)

	MemberList(filter *constant.UserFilter, pagination *helper.Pagination) (interface{}, error)

	ParentList(search string, pagination *helper.Pagination) ([]*constant.Parent, error)
	StudentList(filter *constant.StudentFilter, pagination *helper.Pagination) ([]*constant.Student, error)

	SchoolList(*helper.Pagination) ([]*constant.SchoolList, error)
	AcademicYearList(*helper.Pagination, int) ([]*int, error)
	YearList(filter *constant.DropdownFilter, pagination *helper.Pagination) ([]*string, error)
	ClassList(filter *constant.DropdownFilter, pagination *helper.Pagination) ([]*constant.ClassList, error)
}
