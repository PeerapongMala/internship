package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) EvaluationSheetInsert(tx *sqlx.Tx, entities []*constant.EvaluationSheetEntity) (err error) {

	query := `
		INSERT INTO grade.evaluation_sheet (
			form_id, 
			value_type, 
			evaluation_form_subject_id, 
			evaluation_form_general_evaluation_id, 
			is_lock, 
			status, 
			created_at, 
			created_by, 
			updated_at, 
			updated_by, 
			admin_login_as
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
	`

	for _, entity := range entities {
		_, err = tx.Exec(
			query,
			entity.FormID,
			entity.ValueType,
			entity.EvaluationFormSubjectID,
			entity.EvaluationFormGeneralEvaluationID,
			entity.IsLock,
			entity.GetStatus(),
			entity.CreatedAt,
			entity.CreatedBy,
			entity.UpdatedAt,
			entity.UpdatedBy,
			entity.AdminLoginAs,
		)

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	return nil
}
