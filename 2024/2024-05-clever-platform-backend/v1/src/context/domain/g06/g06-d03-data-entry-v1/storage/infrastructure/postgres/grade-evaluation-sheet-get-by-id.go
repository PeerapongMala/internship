package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) EvaluationSheetGetById(id int) (*constant.EvaluationSheetEntity, error) {
	query := `
		SELECT 
			id,
			form_id,
			value_type,
			evaluation_form_subject_id,
			evaluation_form_general_evaluation_id,
			is_lock,
			status,
			created_at,
			created_by,
			updated_at,
			(SELECT "sub_u"."first_name" FROM "user"."user" sub_u WHERE sub_u."id" = updated_by LIMIT 1) AS updated_by,
			admin_login_as
		FROM
			grade.evaluation_sheet
		WHERE id = $1
	`

	var entity constant.EvaluationSheetEntity
	err := postgresRepository.Database.QueryRowx(query, id).StructScan(&entity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &entity, nil
}
