package postgres

import (
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradeGeneralEvaluationUpdate(tx *sqlx.Tx, entity *constant.TemplateGeneralEvaluationEntity) error {

	query := `
		UPDATE grade.template_general_evaluation
		SET
	`
	var updates []string
	var args []interface{}
	args = append(args, entity.Id)

	if entity.TemplateType != "" {
		updates = append(updates, `"template_type" = $2`)
		args = append(args, entity.TemplateType)
	}

	if entity.TemplateName != "" {
		updates = append(updates, `"template_name" = $3`)
		args = append(args, entity.TemplateName)
	}

	if entity.AdditionalData != nil {
		updates = append(updates, `"additional_data" = $4`)
		args = append(args, entity.AdditionalData)
	}

	if len(updates) == 0 {
		return nil // No updates to be made
	}

	query += strings.Join(updates, ", ")
	query += ` WHERE "id" = $1;`

	_, err := tx.Exec(
		query,
		args...,
	)

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
