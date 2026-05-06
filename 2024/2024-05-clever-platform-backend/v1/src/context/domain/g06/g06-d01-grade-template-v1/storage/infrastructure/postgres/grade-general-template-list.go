package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradeGeneralTemplateList(schoolId int, status string, pagination *helper.Pagination) ([]constant.GradeGeneralTemplateEntity, error) {
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
		WHERE school_id = $1
	`

	baseArgs := []any{schoolId}
	argsIndex := 1
	if status != "" {
		query += fmt.Sprintf(" AND status = $%d", argsIndex+1)
		argsIndex++
		baseArgs = append(baseArgs, status)
	}

	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
	err := postgresRepository.Database.QueryRowx(countQuery, baseArgs...).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	query += fmt.Sprintf(` ORDER BY created_at DESC OFFSET $%d LIMIT $%d`, argsIndex+1, argsIndex+2)
	argsIndex = argsIndex + 2
	baseArgs = append(baseArgs, pagination.Offset, pagination.LimitResponse)

	entities := []constant.GradeGeneralTemplateEntity{}
	err = postgresRepository.Database.Select(&entities, query, baseArgs...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, err
}
