package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) EvaluationFormInsert(tx *sqlx.Tx, entity *constant.GradeEvaluationFormEntity) (insertId int, err error) {

	query := `
		INSERT INTO grade.evaluation_form (
			"school_id",
			"template_id",
			"academic_year",
			"year",
			"school_room",
			"school_term",
			"is_lock",
			"status",
			"created_at",
			"created_by",
			"updated_at",
			"updated_by",
			"wizard_index"
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
		RETURNING id;
	`

	err = tx.QueryRowx(
		query,
		entity.SchoolId,
		entity.TemplateId,
		entity.AcademicYear,
		entity.Year,
		entity.SchoolRoom,
		entity.SchoolTerm,
		entity.IsLock,
		entity.Status,
		entity.CreatedAt,
		entity.CreatedBy,
		entity.UpdatedAt,
		entity.UpdatedBy,
		entity.WizardIndex,
	).Scan(&insertId)

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return insertId, err
	}

	return insertId, nil
}
