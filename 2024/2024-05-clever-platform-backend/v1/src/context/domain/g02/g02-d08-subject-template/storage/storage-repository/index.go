package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d08-subject-template/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)
	SubjectTemplateCreate(subjectTemplate *constant.SubjectTemplateEntity) (*constant.Id, error)
	SubjectTemplateList(filter *constant.SubjectTemplateFilter, pagination *helper.Pagination) ([]constant.SubjectTemplateEntity, error)
	SubjectTemplateIndicatorUpdate(tx *sqlx.Tx, subjectTemplateId int, indicators []constant.SubjectTemplateIndicatorEntity) error
	SubjectTemplateUpdate(tx *sqlx.Tx, template *constant.SubjectTemplateEntity) error
	SubjectTemplateCaseBulkEdit(tx *sqlx.Tx, m map[string][]int) error
	SubjectTemplateIndicatorGet(id int) (*constant.SubjectTemplateIndicatorEntity, error)
}
