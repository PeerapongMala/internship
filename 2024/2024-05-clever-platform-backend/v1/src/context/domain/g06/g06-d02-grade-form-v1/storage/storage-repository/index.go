package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"

	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	GradeEvaluationFormList(filter constant.GradeEvaluationFormListFilter, pagination *helper.Pagination) ([]constant.GradeFormListEntity, error)
	EvaluationFormInsert(tx *sqlx.Tx, entity *constant.GradeEvaluationFormEntity) (insertId int, err error)
	EvaluationFormSubjectInsert(tx *sqlx.Tx, entity *constant.GradeEvaluationFormSubjectEntity) (insertId int, err error)
	EvaluationFormIndicatorInsert(tx *sqlx.Tx, entity *constant.GradeEvaluationFormIndicatorEntity) (insertId int, err error)
	EvaluationFormSettingInsert(tx *sqlx.Tx, entity *constant.GradeEvaluationFormSettingEntity) (insertId int, err error)
	EvaluationFormIndicatorUpsert(tx *sqlx.Tx, entity *constant.GradeEvaluationFormIndicatorEntity) (insertId int, err error)
	EvaluationFormSettingUpsert(tx *sqlx.Tx, entity *constant.GradeEvaluationFormSettingEntity) (insertId int, err error)
	DeleteGradeEvaluationIndicatorAndSettingNotActive(tx *sqlx.Tx, subjectID int, activeIndicatorID []int) error
	EvaluationFormGeneralEvaluationInsert(tx *sqlx.Tx, entity *constant.GradeEvaluationFormGeneralEvaluationEntity) (insertId int, err error)
	GradeEvaluationFormGetById(id int) (*constant.GradeEvaluationFormEntity, error)
	GradeEvaluationFormGetActiveByFilter(tx *sqlx.Tx, schoolID int, academicYear, year, schoolRoom string) (*constant.GradeEvaluationFormEntity, error)
	GradeEvaluationFormUpdate(tx *sqlx.Tx, entity *constant.GradeEvaluationFormEntity) error
	EvaluationSheetInsert(tx *sqlx.Tx, entities []*constant.EvaluationSheetEntity) (err error)
	EvaluationSheetUpdate(tx *sqlx.Tx, entity *constant.EvaluationSheetEntity) error
	EvaluationSheetUpdateStatus(tx *sqlx.Tx, formID int, isLock *bool, statusFrom constant.EvaluationSheetStatus, statusTo constant.EvaluationSheetStatus, updateBy string) (ids []int, err error)
	EvaluationSheetUpdateStatusByIDs(tx *sqlx.Tx, ids []int, status constant.EvaluationSheetStatus, updateBy string) (err error)
	EvaluationSheetList(tx *sqlx.Tx, filter constant.EvaluationSheetListFilter, pagination *helper.Pagination) ([]constant.EvaluationSheetListEntity, error)

	GradeEvaluationSubjectGetByFormId(formId int, includeDetail bool) ([]constant.GradeEvaluationFormSubjectWithNameEntity, error)
	GradeEvaluationSubjectGetBySheetId(sheetId int, includeDetail bool) (*constant.GradeEvaluationFormSubjectWithNameEntity, error)
	GradeEvaluationGeneralEvaluationGetByFormId(formId int) ([]constant.GradeEvaluationFormGeneralEvaluationEntity, error)
	AdditionalPersonWithPersonalDataGet(formId int) ([]constant.AdditionalPersonWithPersonDataEntity, error)
	DeleteAllAdditionalPersonByFormId(tx *sqlx.Tx, id int) error
	InsertAdditionalPerson(tx *sqlx.Tx, entity *constant.GradeEvaluationFormAdditionalPersonEntity) (insertId int, err error)
	EvaluationFormSubjectUpdate(tx *sqlx.Tx, id int, cleverSubjectTemplateId *int, subjectNo *string, learningArea *string, credits *float64, isExtra *bool, subjectName *string, isClever *bool, cleverSubjectId *int, hours *int) error

	AdditionalPersonPrefill(tx *sqlx.Tx, formId int, teacherId string) error
	SubjectTeacherList(subjectId int, formId int) ([]constant.AdditionalPersonWithPersonDataEntity, error)
	ClassTeacherList(sheetId int) ([]constant.AdditionalPersonWithPersonDataEntity, error)
	GradeEvaluationIndicatorGet(indicatorId int) (*constant.GradeEvaluationFormIndicatorEntity, error)
	StudentCaseGetByClass(tx *sqlx.Tx, academicYear int, year string, name string) ([]constant.StudentEntity, error)
	EvaluationStudentCreate(tx *sqlx.Tx, students []constant2.EvaluationStudent) error
	GradeEvaluationSubjectNotActiveDelete(tx *sqlx.Tx, activeSubjectIds []int, formId int) error
}
