package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GradeGeneralTemplateGetById(id int) (*constant.GradeGeneralTemplateEntity, error) {
	query := `
		SELECT 
			id,
			school_id,
			template_type,
			template_name,
			status,
			active_flag,
			created_at,
			created_by,
			updated_at,
			(SELECT "sub_u"."first_name" FROM "user"."user" sub_u WHERE sub_u."id" = updated_by LIMIT 1) AS updated_by,
			additional_data
		FROM
			grade.general_template
		WHERE id = $1
	`

	var entity constant.GradeGeneralTemplateEntity
	err := postgresRepository.Database.QueryRowx(query, id).StructScan(&entity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &entity, nil
}
