package storageRepository

import (
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	academicCourseConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	LearningAreaCreate(c constant.LearningAreaCreateRequest, txs ...*sqlx.Tx) error
	LearningAreaUpdate(c constant.LearningAreaUpdateRequest, txs ...*sqlx.Tx) error
	GetLearningArea(curriculumGroupId int, filter constant.LearningAreaFilter, pagination *helper.Pagination) ([]constant.LearningAreaResponse, int, error)
	///////////////////////////
	ContentCreate(c constant.ContentCreateRequest, txs ...*sqlx.Tx) error
	ContentUpdate(c constant.ContentUpdateRequest, txs ...*sqlx.Tx) error
	GetContent(curriculumGroupId int, filter constant.ContentFilter, pagination *helper.Pagination) ([]constant.ContentResponse, int, error)
	///////////////////////////
	CriteriaCreate(c constant.CriteriaCreateRequest, txs ...*sqlx.Tx) error
	CriteriaUpdate(c constant.CriteriaUpdateRequest, txs ...*sqlx.Tx) error
	GetCriteria(curriculumGroupId int, filter constant.CriteriaFilter, pagination *helper.Pagination) ([]constant.CriteriaResponse, int, error)
	///////////////////////////
	LearningContentCreate(c constant.LearningContentCreateRequest, txs ...*sqlx.Tx) error
	LearningContentUpdate(c constant.LearningContentUpdateRequest, txs ...*sqlx.Tx) error
	GetLearningContent(curriculumGroupId int, filter constant.LearningContentFilter, pagination *helper.Pagination) ([]constant.LearningContentResponse, int, error)
	///////////////////////////
	IndicatorsCreate(c constant.IndicatorsCreateRequest, txs ...*sqlx.Tx) error
	IndicatorUpdate(c constant.IndicatorsUpdateRequest, txs ...*sqlx.Tx) error
	GetIndicators(curriculumGroupId int, filter constant.IndicatorsFilter, pagination *helper.Pagination) ([]constant.IndicatorsResponse, int, error)
	///////////////////////////
	SubCriteriaUpdate(c constant.SubCriteriaUpdateRequest) error
	SubCriteriaTopicCreate(c constant.SubCriteriaTopicsCreateRequest, txs ...*sqlx.Tx) error

	LearningAreaGet(learningAreaId int) (*constant.LearningAreaEntity, error)
	ContentGet(contentId int) (*constant.ContentEntity, error)
	CriteriaGet(criteriaId int) (*constant.CriteriaEntity, error)
	LearningContentGet(learningContentId int) (*constant.LearningContentEntity, error)
	IndicatorGet(indicatorId int) (*constant.IndicatorEntity, error)
	YearCaseListByCurriculumGroupId(pagination *helper.Pagination, curriculumGroupId int) ([]constant.YearEntity, error)

	SubCriteriaTopicGet(subCriteriaTopicId int) (*constant.SubCriteriaTopicEntity, error)
	SubCriteriaCaseListByCurriculumGroupId(curriculumGroupId int) ([]constant.SubCriteriaEntity, error)
	SubCriteriaTopicUpdate(c constant.SubCriteriaTopicsUpdateRequest, txs ...*sqlx.Tx) error
	GetTopic(SubcriteriaId int, filter constant.TopicsFilter, pagination *helper.Pagination) ([]constant.TopicResponse, int, error)
	GetReport(SubcriteriaId int, pagination *helper.Pagination) ([]constant.ReportResponse, int, error)

	CurriculumGroupCaseListContentCreator(curriculumGroupId int) ([]userConstant.UserEntity, error)

	LearningAreaCaseGetCurriculumGroupId(learningAreaId int) (*int, error)
	ContentCaseGetCurriculumGroupId(contentId int) (*int, error)
	CriteriaCaseGetCurriculumGroupId(criteriaId int) (*int, error)
	LearningContentCaseGetCurriculumGroupId(learningContentId int) (*int, error)
	IndicatorCaseGetCurriculumGroupId(indicatorId int) (*int, error)

	LearningAreaCaseBulkUpdate(tx *sqlx.Tx, learningArea *constant.LearningAreaEntity) (*constant.LearningAreaEntity, error)
	ContentCaseBulkUpdate(tx *sqlx.Tx, content *constant.ContentEntity) (*constant.ContentEntity, error)
	CriteriaCaseBulkUpdate(tx *sqlx.Tx, criteria *constant.CriteriaEntity) (*constant.CriteriaEntity, error)
	LearningContentCaseBulkUpdate(tx *sqlx.Tx, learningContent *constant.LearningContentEntity) (*constant.LearningContentEntity, error)
	IndicatorCaseBulkUpdate(tx *sqlx.Tx, indicator *constant.IndicatorEntity) (*constant.IndicatorEntity, error)

	YearList() ([]academicCourseConstant.YearWithSubjectEntity, error)
	CheckContentCreator(CurriculumGroupId int, Subjectid string) (bool, error)
	GetBylearningAreaId(LearningAreaId int) (int, error)
	GetByContentId(ContentId int) (int, error)
	GetByCriteriaId(CriteriaId int) (int, error)
	GetByLearningContentId(LearningContentId int) (int, error)
	GetBySubCriteriaId(SubCriteriaId int) (int, error)
	SubCriteriaTopicCaseGetCurriculumGroupId(subCriteriaTopicId int) (*int, error)
	SubCriteriaTopicCaseBulkUpdate(tx *sqlx.Tx, subCriteria *constant.SubCriteriaTopicEntity) error
}
