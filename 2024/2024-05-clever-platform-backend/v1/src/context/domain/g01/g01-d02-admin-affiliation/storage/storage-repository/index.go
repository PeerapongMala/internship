package storageRepository

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	SchoolAffiliationCreate(tx *sqlx.Tx, schoolAffiliation *constant2.SchoolAffiliationEntity) (*constant2.SchoolAffiliationEntity, error)
	SchoolAffiliationGet(schoolAffiliationId int) (*constant.SchoolAffiliationEntity, error)
	SchoolAffiliationUpdate(tx *sqlx.Tx, schoolAffiliation *constant2.SchoolAffiliationEntity) (*constant2.SchoolAffiliationEntity, error)
	SchoolAffiliationList(filter *constant2.SchoolAffiliationFilter, pagination *helper.Pagination) ([]constant2.SchoolAffiliationEntity, error)
	SchoolAffiliationCaseListByDate(startDate, endDate *time.Time) ([]constant.SchoolAffiliationEntity, error)

	SchoolAffiliationDoeCreate(tx *sqlx.Tx, schoolAffiliationDoe *constant2.SchoolAffiliationDoeEntity) (*constant2.SchoolAffiliationDoeEntity, error)
	SchoolAffiliationDoeGet(schoolAffiliationId int) (*constant.SchoolAffiliationDoeEntity, error)
	SchoolAffiliationDoeUpdate(tx *sqlx.Tx, schoolAffiliationDoe *constant2.SchoolAffiliationDoeEntity) (*constant2.SchoolAffiliationDoeEntity, error)
	SchoolAffiliationDoeList(filter *constant2.SchoolAffiliationDoeFilter, pagination *helper.Pagination) ([]constant2.SchoolAffiliationDoeDataEntity, error)

	SchoolAffiliationLaoCreate(tx *sqlx.Tx, schoolAffiliationLao *constant2.SchoolAffiliationLaoEntity) (*constant2.SchoolAffiliationLaoEntity, error)
	SchoolAffiliationLaoGet(schoolAffiliationId int) (*constant.SchoolAffiliationLaoEntity, error)
	SchoolAffiliationLaoUpdate(tx *sqlx.Tx, schoolAffiliationLao *constant2.SchoolAffiliationLaoEntity) (*constant2.SchoolAffiliationLaoEntity, error)
	SchoolAffiliationLaoList(filter *constant2.SchoolAffiliationLaoFilter, pagination *helper.Pagination) ([]constant2.SchoolAffiliationLaoDataEntity, error)

	SchoolAffiliationObecCreate(tx *sqlx.Tx, schoolAffiliationObec *constant2.SchoolAffiliationObecEntity) (*constant2.SchoolAffiliationObecEntity, error)
	SchoolAffiliationObecGet(schoolAffiliationId int) (*constant.SchoolAffiliationObecEntity, error)
	SchoolAffiliationObecUpdate(tx *sqlx.Tx, schoolAffiliationObec *constant2.SchoolAffiliationObecEntity) (*constant2.SchoolAffiliationObecEntity, error)
	SchoolAffiliationObecList(filter *constant2.SchoolAffiliationObecFilter, pagination *helper.Pagination) ([]constant2.SchoolAffiliationObecDataEntity, error)

	ContractCreate(contract *constant2.ContractEntity) (*constant2.ContractEntity, error)
	ContractGet(contractId int) (*constant2.ContractEntity, error)
	ContractUpdate(tx *sqlx.Tx, contract *constant2.ContractEntity) (*constant2.ContractEntity, error)
	ContractCaseAddSchool(tx *sqlx.Tx, contractId int, schoolIds []int) ([]int, error)
	ContractCaseDeleteSchool(tx *sqlx.Tx, contractId int, schoolIds []int) ([]int, error)
	ContractCaseAddSubjectGroup(tx *sqlx.Tx, contractId int, subjects []constant2.ContractSubjectGroupEntity) ([]constant2.ContractSubjectGroupEntity, error)
	ContractCaseDeleteSubjectGroup(tx *sqlx.Tx, contractId int, subjectGroups []int) ([]int, error)
	SchoolAffiliationCaseListContract(schoolAffiliationId int, filter *constant2.ContractFilter, pagination *helper.Pagination) ([]constant2.ContractWithSchoolCountEntity, error)
	ContractCaseListSubjectGroup(contractId int, filter *constant2.ContractSubjectGroupFilter, pagination *helper.Pagination) ([]constant2.ContractSubjectGroupDataEntity, error)
	ContractCaseListSchool(contractId int, filter *constant2.ContractSchoolFilter, pagination *helper.Pagination) ([]interface{}, error)
	ContractCaseListSchoolId(contractId int) ([]int, error)
	ContractCaseToggleSubjectGroup(tx *sqlx.Tx, contractId int, subjectGroupId int, isEnabled bool) error

	SubjectList(pagination *helper.Pagination, filter *constant.SubjectFilter) ([]constant.SubjectListDataEntity, error)
	CurriculumGroupList(pagination *helper.Pagination, filter *constant.CurriculumGroupFilter) ([]constant.CurriculumGroupEntity, error)
	YearList(pagination *helper.Pagination, curriculumGroupId int) ([]constant.YearEntity, error)
	SubjectGroupList(pagination *helper.Pagination, seedYearId, platformId int) ([]constant.SubjectGroupEntity, error)

	SchoolCaseListBySchoolAffiliation(pagination *helper.Pagination, searchText string, schoolAffiliationId int) ([]constant2.ContractSchoolDataEntity, error)

	CurriculumGroupCreate(tx *sqlx.Tx, curriculumGroup *constant.CurriculumGroupEntity) (*constant.CurriculumGroupEntity, error)
	CurriculumGroupGet(curriculumGroupId int) (*constant.CurriculumGroupEntity, error)
	CurriculumGroupUpdate(tx *sqlx.Tx, curriculumGroup *constant.CurriculumGroupEntity) (*constant.CurriculumGroupEntity, error)

	SubCriteriaCreate(tx *sqlx.Tx, subCriteria *constant.SubCriteriaEntity) (*constant.SubCriteriaEntity, error)

	ContentCreatorList(filter *constant.UserFilter, pagination *helper.Pagination) ([]constant.UserEntity, error)
	CurriculumGroupCaseAddContentCreator(tx *sqlx.Tx, curriculumGroupId int, contentCreatorId string) error
	CurriculumGroupCaseRemoveContentCreator(tx *sqlx.Tx, curriculumGroupId int, contentCreatorId string) error
	SeedYearUpdate(tx *sqlx.Tx, seedYear *constant.SeedYearEntity) (*constant.SeedYearEntity, error)
	SeedYearList(filter *constant.SeedYearFilter, pagination *helper.Pagination) ([]constant.SeedYearEntity, error)
	SeedYearCreate(tx *sqlx.Tx, seedYear *constant.SeedYearEntity) (*constant.SeedYearEntity, error)
	SeedYearGet(seedYearId int) (*constant.SeedYearEntity, error)

	SchoolCaseAddContractSubject(tx *sqlx.Tx, contractId int) error
	SchoolCaseRemoveContractSubject(tx *sqlx.Tx, contractId, schoolId int) error
	SeedPlatformList() ([]constant.SeedPlatformEntity, error)

	ClassList(schoolIds []int) ([]int, error)
	ContractCaseListSubject(contractId int) ([]int, error)
	ContractCaseListLesson(contractId int) ([]int, error)
	ContractCaseListSubLesson(contractId int) ([]int, error)
	SchoolSubjectCreate(tx *sqlx.Tx, contractId int, schoolIds, subjectIds []int) error
	SchoolLessonCreate(tx *sqlx.Tx, schoolId int, lessonIds []int, classIds []int) error
	SchoolSubLessonCreate(tx *sqlx.Tx, schoolId int, subLessonIds []int, classIds []int) error
	LessonLevelLockCreate(tx *sqlx.Tx, classIds []int, lessonIds []int) error
}
