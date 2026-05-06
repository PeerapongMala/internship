package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/jmoiron/sqlx"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type Repository interface {
	// SQL Utils
	BeginTx() (*sqlx.Tx, error)

	//GradeTemplate
	GradeTemplateList(schoolId int, year string, activeFlag *bool, status []string, pagination *helper.Pagination, search *string) ([]constant.GradeTemplateListEntity, error)
	GradeTemplateInsert(tx *sqlx.Tx, entity *constant.GradeTemplateEntity) (insertId int, err error)
	GradeTemplateUpdate(tx *sqlx.Tx, entity *constant.GradeTemplateEntity) error
	GradeTemplateGetById(id int) (*constant.GradeTemplateWithSubject, error)
	DeleteGradeTemplateNotActive(tx *sqlx.Tx, templateID int, activeGeneralTemplateID []int) error
	GradeSubjectInsert(tx *sqlx.Tx, entity *constant.SubjectEntity) (insertId int, err error)
	GradeSubjectUpdate(tx *sqlx.Tx, entity *constant.SubjectEntity) error
	DeleteGradeSubjectNotActive(tx *sqlx.Tx, templateID int, activeSubjectID []int) error
	GradeGeneralEvaluationInsert(tx *sqlx.Tx, entity *constant.TemplateGeneralEvaluationEntity) (insertId int, err error)
	GradeGeneralEvaluationUpdate(tx *sqlx.Tx, entity *constant.TemplateGeneralEvaluationEntity) error
	GradeSubjectByTemplateId(id int) ([]constant.GradeSubjectWithIndicator, error)
	GradeIndicatorInsert(tx *sqlx.Tx, entity *constant.TemplateIndicatorEntity) (insertId int, err error)
	GradeIndicatorUpdate(tx *sqlx.Tx, entity *constant.TemplateIndicatorEntity) error
	DeleteGradeIndicatorById(id int) error
	GradeIndicatorWithAssesmentSettingByIndicatorId(id int) (*constant.GradeIndicatorWithAssesmentSetting, error)
	GradeAssesmentSettingInsert(tx *sqlx.Tx, entity *constant.TemplateAssessmentSettingEntity) (insertId int, err error)
	GradeAssesmentSettingUpdate(tx *sqlx.Tx, entity *constant.TemplateAssessmentSettingEntity) error
	DeleteGradeAssesmentSettingByIndicatorId(id int) error
	DeleteGradeIndicatorAndSettingNotActive(tx *sqlx.Tx, subjectID int, activeIndicatorID []int) error
	TemplateSubjectUpdate(tx *sqlx.Tx, id int, cleverSubjectTemplateId *int) error

	// GeneralTemplate
	GradeGeneralTemplateList(schoolId int, status string, pagination *helper.Pagination) ([]constant.GradeGeneralTemplateEntity, error)
	GradeGeneralTemplateGetById(id int) (*constant.GradeGeneralTemplateEntity, error)
	GradeGeneralTemplateInsert(tx *sqlx.Tx, entity *constant.GradeGeneralTemplateEntity) (insertId int, err error)
	GradeGeneralTemplateUpdate(tx *sqlx.Tx, entity *constant.GradeGeneralTemplateEntity) error

	// drop-down data
	YearList(pagination *helper.Pagination, curriculumGroupId int) ([]constant.YearEntity, error)
	IndicatorListBySubject(subjectId int) ([]constant.IndicatorEntity, error)
}
