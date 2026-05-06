package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) TeacherSubjectList(userId string, pagination *helper.Pagination, year string) ([]constant.Subject, error) {
	query := `
		SELECT
			"s"."id",
			"s"."name",
			"sy"."short_name" AS "year_name"
		FROM "subject"."subject_teacher" st
		INNER JOIN "subject"."subject" s ON "st"."subject_id" = "s"."id"
		INNER JOIN "curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"
		INNER JOIN "curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
		INNER JOIN "curriculum_group"."seed_year" sy ON "y"."seed_year_id" = "sy"."id"
		WHERE
			"teacher_id" = $1
	`
	args := []interface{}{userId}
	argsIndex := len(args) + 1

	if year != "" {
		query += fmt.Sprintf(` AND "sy"."short_name" = $%d`, argsIndex)
		argsIndex++
		args = append(args, year)
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "s"."id" DESC OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	subjects := []constant.Subject{}
	err := postgresRepository.Database.Select(&subjects, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subjects, nil
}
