package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d09-admin-report-permission-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)
	ObserverAccessCreate(observerAccess *constant.ObserverAccessEntity) (*constant.ObserverAccessEntity, error)
	ObserverAccessUpdate(tx *sqlx.Tx, observerAccess *constant.ObserverAccessEntity) (*constant.ObserverAccessEntity, error)
	ObserverAccessGet(observerAccessId *int) (*constant.ObserverAccessEntity, error)
	ObserverAccessList(filter *constant.ObserverAccessFilter, pagination *helper.Pagination) ([]constant.ObserverAccessEntity, error)
	ObserverAccessCaseUpdateSchool(tx *sqlx.Tx, observerAccessId *int, schoolIds []int) ([]int, error)
	ObserverAccessCaseDeleteSchool(tx *sqlx.Tx, observerAccessId int, schoolIds []int) error
	ObserverAccessCaseDeleteAllSchool(tx *sqlx.Tx, observerAccessId int) error
	ObserverAccessCaseListSchool(filter *constant.ObserverAccessSchoolFilter, pagination *helper.Pagination) ([]constant.ObserverAccessSchoolEntity, error)
	SchoolList(filter *constant.SchoolFilter, pagination *helper.Pagination) ([]constant.SchoolEntity, error)
	SchoolAffiliationList(filter *constant.SchoolAffiliationFilter, pagination *helper.Pagination) ([]constant.SchoolAffiliationEntity, error)
	ObserverAccessCasePatchSchool(tx *sqlx.Tx, observerAccessId *int, schoolIds []int) ([]int, error)
}
