package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d06-grade-porphor6-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradPorphor6EvaluationformGet(id string) (*constant.GradeEvaluationFormEntity, error) {
	query := `
		SELECT
			id,
			school_id,
			template_id,
			academic_year,
			year,
			school_room,
			school_term,
			is_lock, status,
			created_at,
			created_by,
			updated_at,
			updated_by,
			admin_login_as
		FROM
			grade.evaluation_form
		WHERE id = $1
	`

	var entity constant.GradeEvaluationFormEntity
	err := postgresRepository.Database.QueryRowx(query, id).StructScan(&entity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &entity, nil
}
