package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) TeacherCaseListClassLog(teacherId string, pagination *helper.Pagination) ([]constant.ClassLogEntity, error) {
	query := `
		SELECT
			"c"."id" AS "class_id",
			"c"."year" AS "class_year",
			"c"."name" AS "class_name"	
		FROM
			"school"."class_teacher" ct
		LEFT JOIN
			"class"."class" c
			ON "ct"."class_id" = "c"."id"
		WHERE
			"ct"."teacher_id" = $1
	`
	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, teacherId).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	query += fmt.Sprintf(` ORDER BY "c"."id" LIMIT $2 OFFSET $3`)

	classLogEntities := []constant.ClassLogEntity{}
	err := postgresRepository.Database.Select(&classLogEntities, query, teacherId, pagination.Limit, pagination.Offset)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return classLogEntities, nil
}
