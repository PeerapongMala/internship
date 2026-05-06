package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradeGeneralEvaluationInsert(tx *sqlx.Tx, entity *constant.TemplateGeneralEvaluationEntity) (insertId int, err error) {

	query := `
		INSERT INTO grade.template_general_evaluation (
			"template_id",
			"template_type",
			"template_name",
			"additional_data",
			"general_template_id"
		)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id;
	`

	err = tx.QueryRowx(
		query,
		entity.TemplateId,
		entity.TemplateType,
		entity.TemplateName,
		entity.AdditionalData,
		entity.GeneralTemplateID,
	).Scan(&insertId)

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return insertId, err
	}

	return insertId, nil
}
