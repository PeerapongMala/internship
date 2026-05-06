package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) StudentCaseListClasses(userId string, pagination *helper.Pagination) ([]constant.ClassEntity, error) {
	query := `
		SELECT
			"c".*
		FROM
			"school"."class_student" cs
		LEFT JOIN
			"class"."class" c	
			ON "cs"."class_id" = "c"."id"
		WHERE
			"cs"."student_id" = $1
		ORDER BY
			"c"."academic_year" ASC
	`

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, userId).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	query += fmt.Sprintf(` LIMIT $2 OFFSET $3`)

	classEntities := []constant.ClassEntity{}
	err := postgresRepository.Database.Select(&classEntities, query, userId, pagination.Limit, pagination.Offset)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return classEntities, nil
}
