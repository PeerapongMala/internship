package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LessonList(filter *constant.LessonFilter, pagination *helper.Pagination) ([]constant.LessonEntity, error) {
	query := `
		SELECT
			"ls"."id",
			"ls"."name"
		FROM
		    "subject"."lesson" ls
		LEFT JOIN
			"subject"."subject" s
			ON "ls"."subject_id" = "s"."id"
		WHERE
		    TRUE
	`
	args := []interface{}{}
	argsIndex := 1

	if filter.SubjectId != 0 {
		query += fmt.Sprintf(` AND "s"."id" = $%d`, argsIndex)
		args = append(args, filter.SubjectId)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "ls"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	lessonEntities := []constant.LessonEntity{}
	err := postgresRepository.Database.Select(&lessonEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return lessonEntities, nil
}
