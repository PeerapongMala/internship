package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository postgresRepository) GetLessonFromSubjectIds(subjectIds []int, pagination *helper.Pagination) (entities []constant.LessonEntity, err error) {
	query := `
		SELECT
			"sl".*,
			"ss"."name" AS "subject_name"
		FROM
			"subject"."lesson" sl
		LEFT JOIN "subject"."subject" ss ON "sl"."subject_id" = "ss"."id"
	`
	args := []interface{}{}
	argsIndex := 1

	if len(subjectIds) > 0 {
		query += fmt.Sprintf(` WHERE "ss"."id" = ANY($%d)`, argsIndex)
		args = append(args, subjectIds)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "sl"."index" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		item := constant.LessonEntity{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)
	}
	return
}
