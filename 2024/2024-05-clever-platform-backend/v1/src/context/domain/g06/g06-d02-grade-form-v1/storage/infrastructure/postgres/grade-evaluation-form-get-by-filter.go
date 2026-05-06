package postgres

import (
	"database/sql"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GradeEvaluationFormGetActiveByFilter(tx *sqlx.Tx, schoolID int, academicYear, year, schoolRoom string) (*constant.GradeEvaluationFormEntity, error) {

	query := `
		SELECT 
			id,
			school_id,
			template_id,
			academic_year,
			year,
			school_room,
			school_term,
			is_lock,
			status,
			created_at,
			created_by,
			updated_at,
			(SELECT "sub_u"."first_name" FROM "user"."user" sub_u WHERE sub_u."id" = updated_by LIMIT 1) AS updated_by,
			is_archived,
			wizard_index
		FROM
			grade.evaluation_form
		WHERE school_id = $1 AND academic_year = $2 AND year = $3 AND school_room = $4 AND is_archived IS FALSE
	`

	var entity constant.GradeEvaluationFormEntity
	err := tx.QueryRowx(query, schoolID, academicYear, year, schoolRoom).StructScan(&entity)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &entity, nil
}
