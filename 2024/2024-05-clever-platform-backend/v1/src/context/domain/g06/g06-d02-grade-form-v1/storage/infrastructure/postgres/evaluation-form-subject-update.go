package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) EvaluationFormSubjectUpdate(tx *sqlx.Tx, id int, cleverSubjectTemplateId *int, subjectNo *string, learningArea *string, credits *float64, isExtra *bool, subjectName *string, isClever *bool, cleverSubjectId *int, hours *int) error {
	query := `
		UPDATE "grade"."evaluation_form_subject"
		SET 
			"clever_subject_template_id" = $1,
			"subject_no" = $3,
			"learning_area" = $4,
			"credits" = $5,
			"is_extra" = $6,
			"subject_name" = $7,
			"is_clever" = $8,
			"clever_subject_id" = $9,
			"hours" = $10
		WHERE "id" = $2
	`
	_, err := tx.Exec(query, cleverSubjectTemplateId, id, subjectNo, learningArea, credits, isExtra, subjectName, isClever, cleverSubjectId, hours)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
