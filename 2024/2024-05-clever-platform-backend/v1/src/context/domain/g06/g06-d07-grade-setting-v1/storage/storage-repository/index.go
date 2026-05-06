package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	SchoolGetIDByCode(tx *sqlx.Tx, schoolCode string) (schoolID int, err error)
	GradeStudentInformationUpsert(tx *sqlx.Tx, schoolID int, academicYear, year, schoolRoom string, entity *constant.EvaluationStudent) (err error)
	GradeEvaluationStudentList(filter constant.GradeEvaluationStudentFilter, pagination *helper.Pagination) ([]constant.GradeEvaluationStudentFilterResult, error)
	GradeEvaluationFormGetById(id int) (*constant.EvaluationStudent, error)
	GradeEvaluationStudentUpdate(entity constant.EvaluationStudent) error

	DocumentTemplateUpsert(tx *sqlx.Tx, entity *constant.GradeDocumentTemplate) (int, error)
	DocumentTemplateList(schoolID *int, formatId *string, pagination *helper.Pagination, isDefault *bool, id *int, name *string) ([]constant.GradeDocumentTemplate, error)
	GradeDocumentDefaultUpdate(tx *sqlx.Tx, schoolId int, id int) error
	DocumentTemplateCreate(tx *sqlx.Tx, entity *constant.GradeDocumentTemplate) (int, error)
	DocumentTemplateGet(id int) (*constant.GradeDocumentTemplate, error)
	DocumentTemplateDeleteImage(id int, deleteLogoImage, deleteBackgroundImage bool) error
}
