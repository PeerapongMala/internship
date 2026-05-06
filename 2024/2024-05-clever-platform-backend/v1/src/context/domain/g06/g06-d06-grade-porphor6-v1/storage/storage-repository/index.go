package storagerepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d06-grade-porphor6-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	// SQL Utils
	BeginTx() (*sqlx.Tx, error)

	GradPorphor6GetByStudentId(id string) (*constant.GradePorphor6DataEntity, error)
	GradPorphor6EvaluationformGet(id string) (*constant.GradeEvaluationFormEntity, error)
	GradePorphor6List(request constant.GradePorphor6ListRequest, pagination *helper.Pagination) (*[]constant.Porphor6ListResponse, error)
}
