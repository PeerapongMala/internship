package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) EvaluationFormGeneralEvaluationInsert(tx *sqlx.Tx, entity *constant.GradeEvaluationFormGeneralEvaluationEntity) (insertId int, err error) {

	query := `
		INSERT INTO grade.evaluation_form_general_evaluation (
			"form_id",
			"template_type",
			"template_name",
			"additional_data",
			"template_general_evaluation_id"
		)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id;
	`

	err = tx.QueryRowx(
		query,
		entity.FormId,
		entity.TemplateType,
		entity.TemplateName,
		entity.AdditionalData,
		entity.TemplateGeneralEvaluationID,
	).Scan(&insertId)

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return insertId, err
	}

	return insertId, nil
}
