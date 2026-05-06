package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) TeacherCaseListTeachingLog(teacherId string, pagination *helper.Pagination) ([]constant.TeachingLogEntity, error) {
	query := `
		SELECT
			"st"."academic_year",
			"c"."name" AS "curriculum_group_name",
			"s"."name" AS "subject",
			"sy"."short_name" AS "year"
		FROM
			"subject"."subject_teacher" st
		LEFT JOIN
			"subject"."subject" s
			ON "st"."subject_id" = "s"."id"
		LEFT JOIN
			"curriculum_group"."subject_group" sg
			ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN
			"curriculum_group"."year" y
			ON "sg"."year_id" = "y"."id"
		LEFT JOIN
			"curriculum_group"."seed_year" sy
			ON "y"."seed_year_id" = "sy"."id"
		LEFT JOIN
			"curriculum_group"."curriculum_group" c
			ON "y"."curriculum_group_id" = "c"."id"
		WHERE
			"st"."teacher_id" = $1
	`

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, teacherId).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	query += fmt.Sprintf(` LIMIT $2 OFFSET $3`)

	teachingLogEntities := []constant.TeachingLogEntity{}
	err := postgresRepository.Database.Select(&teachingLogEntities, query, teacherId, pagination.Limit, pagination.Offset)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return teachingLogEntities, nil
}
