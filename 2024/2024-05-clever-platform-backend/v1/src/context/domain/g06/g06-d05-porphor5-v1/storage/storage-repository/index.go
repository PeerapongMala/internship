package storageRepository

import (
	"encoding/json"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	Porphor5DataClearAndInsert(tx *sqlx.Tx, entities []*constant.Porphor5DataEntity) (err error)
	Porphor6DataClearAndInsert(tx *sqlx.Tx, entities []*constant.Porphor6DataEntity) (err error)
	GetListPorphor5ByFormID(formID int, ids ...int) ([]constant.Porphor5DataEntity, error)
	GetPorphor6ByFormID(formID int, ids ...int) ([]constant.Porphor6Data, error)
	GetListPorphor6ByFormID(filter constant.Porphor6ListFilter, pagination *helper.Pagination) ([]constant.Porphor6Data, error)
	GetListEvaluationStudent(formID int) ([]constant.EvaluationStudentEntity, error)
	SubjectInfoBySheetID(sheetID int) (*constant.SubjectDataDetail, error)
	FormInfoByFormID(formID int) (*constant.FormDataDetail, error)
	Porphor5UpdateDataJson(tx *sqlx.Tx, formID, id int, dataJson json.RawMessage) (err error)
	Porphor6UpdateDataJson(tx *sqlx.Tx, formID, id int, dataJson json.RawMessage) (err error)
	SchoolAddressGetByFormId(formId int) (*string, *string, error)
	GradeFormGetCredits(formId int) (int, int, error)
}
