package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GradeEvaluationFormGetById(id int) (*constant.GradeEvaluationFormEntity, error) {
	query := `
		SELECT 
			ef.id,
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
			wizard_index,
			COALESCE(COUNT(DISTINCT es."id"), 0) AS "student_count"
		FROM
			grade.evaluation_form ef
		LEFT JOIN "grade"."evaluation_student" es ON "ef"."id" = "es"."form_id"
		WHERE ef.id = $1
		GROUP BY "ef"."id"
	`

	var entity constant.GradeEvaluationFormEntity
	err := postgresRepository.Database.QueryRowx(query, id).StructScan(&entity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &entity, nil
}
