package storageRepository

import (
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	constant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	PlatformCreate(platform *constant.PlatformEntity) (*constant.PlatformEntity, error)
	PlatformGet(platformId int) (*constant.PlatformEntity, error)
	PlatformUpdate(tx *sqlx.Tx, platform *constant.PlatformEntity) (*constant.PlatformEntity, error)
	PlatformList(filter *constant.PlatformFilter, pagination *helper.Pagination) ([]constant.PlatformWithSubjectsEntity, error)
	PlatformCaseGetCurriculumGroupId(platformId int) (*int, error)
	SeedPlatformList(pagination *helper.Pagination) ([]constant.SeedPlatformEntity, error)

	YearCreate(tx *sqlx.Tx, year *constant.YearEntity) (*constant.YearEntity, error)
	YearGet(yearId int) (*constant.YearEntity, error)
	YearUpdate(tx *sqlx.Tx, year *constant.YearEntity) (*constant.YearEntity, error)
	YearList(curriculumGroupId int, filter *constant.YearFilter, pagination *helper.Pagination) ([]constant.YearWithSubjectEntity, error)
	YearCaseGetCurriculumGroupId(yearId int) (*int, error)
	SeedYearList(pagination *helper.Pagination) ([]constant.SeedYearEntity, error)

	SubjectGroupCreate(subjectGroup *constant.SubjectGroupEntity) (*constant.SubjectGroupEntity, error)
	SubjectGroupGet(subjectGroupId int) (*constant.SubjectGroupEntity, error)
	SubjectGroupUpdate(tx *sqlx.Tx, entity *constant.SubjectGroupEntity) (*constant.SubjectGroupEntity, error)
	SubjectGroupList(yearId int, filter *constant.SubjectGroupFilter, pagination *helper.Pagination) ([]constant.SubjectGroupWithSubjectEntity, error)
	SubjectGroupCaseGetCurriculumGroupId(subjectGroupId int) (*int, error)

	SubjectCreate(tx *sqlx.Tx, subject *constant.SubjectEntity) (*constant.SubjectEntity, error)
	SubjectGet(subjectId int) (*constant.SubjectEntity, error)
	SubjectUpdate(tx *sqlx.Tx, subject *constant.SubjectEntity) (*constant.SubjectEntity, error)
	SubjectList(filter *constant.SubjectFilter, pagination *helper.Pagination) ([]constant.SubjectDataEntity, error)
	SubjectCaseGetCurriculumGroupId(subjectId int) (*int, error)

	CurriculumGroupCaseListContentCreator(curriculumGroupId int) ([]userConstant.UserEntity, error)
	SeedSubjectGroupList(pagination *helper.Pagination) ([]constant.SeedSubjectGroupEntity, error)

	TagGroupCreate(tx *sqlx.Tx, tagGroup *constant.TagGroupEntity) (*constant.TagGroupEntity, error)
	TagGroupUpdate(tagGroup *constant.TagGroupEntity) (*constant.TagGroupEntity, error)

	TagGroupCaseGetCurriculumGroupId(tagGroupId int) (*int, error)

	TagCreate(tag *constant.TagEntity) (*constant.TagEntity, error)
	TagGet(tagId int) (*constant.TagEntity, error)
	TagUpdate(tag *constant.TagEntity) (*constant.TagEntity, error)
	TagCaseListBySubjectId(subjectId int) ([]constant.TagGroupWithTagsEntity, error)

	TagCaseGetCurriculumGroupId(tagId int) (*int, error)

	SubjectTranslationCreate(tx *sqlx.Tx, subjectTranslation *constant.SubjectTranslationEntity) (*constant.SubjectTranslationEntity, error)
	SubjectTranslationCaseListBySubject(subjectId int) ([]string, error)
	SubjectTranslationCaseDeleteBySubject(tx *sqlx.Tx, subjectId int) error

	GetYearIdBySubjectGroupId(subjectGroupId int) (yearId int, err error)

	SubjectPrefill(tx *sqlx.Tx, subjectGroupId, subjectId int) error
	SeedSubjectGroupCreate(seedSubjectGroup *constant.SeedSubjectGroupEntity) error
	SeedSubjectGroupUpdate(seedSubjectGroup *constant.SeedSubjectGroupEntity) error
	SeedSubjectGroupGet(id int) (*constant.SeedSubjectGroupEntity, error)
}
