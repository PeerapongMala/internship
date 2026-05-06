package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetHomeworkDetailListByHomeworkId(
	homeworkId int,
	pagination *helper.Pagination,
) (
	[]constant.HomeworkDetailEntity,
	error,
) {

	query := `
		WITH level_order AS (
		    SELECT
		        "l"."id",
 				ROW_NUMBER() OVER (ORDER BY "sl"."index", "l"."index") AS "new_index"
			FROM "homework"."homework" h
			INNER JOIN "homework"."homework_template" ht ON "h"."homework_template_id" = "ht"."id"
			INNER JOIN "subject"."sub_lesson" sl ON "ht"."lesson_id" = "sl"."lesson_id"
			INNER JOIN "level"."level" l ON "sl"."id" = "l"."sub_lesson_id"
			WHERE "h"."id" = $1
			ORDER BY "sl"."index", "l"."index"
		)
		SELECT 
			sl.id AS sub_lesson_id,
			sl.name AS sub_lesson_name,
			l.id AS level_id,
			lo."new_index" AS level_index,
			l.level_type AS level_type,
			l.question_type,
			l.difficulty AS level_difficulty
		FROM homework.homework h 
		LEFT JOIN homework.homework_template ht 
		ON ht.id = h.homework_template_id 
		LEFT JOIN homework.homework_template_level htl 
		ON htl.homework_template_id = h.homework_template_id
		LEFT JOIN "level"."level" l 
		ON l.id = htl.level_id
		LEFT JOIN subject.sub_lesson sl 
		ON sl.id = l.sub_lesson_id 
		LEFT JOIN "level_order" lo ON "lo"."id" = "l"."id"
		WHERE h.id = $1
		ORDER BY sub_lesson_name, level_index
	`

	queryBuilder := helper.NewQueryBuilder(query, homeworkId)
	countQuery, countArgs := queryBuilder.GetTotalCountQueryBuild()

	query, args := queryBuilder.Build()
	if pagination != nil && pagination.Limit.Valid {
		query += fmt.Sprintf(` LIMIT %d OFFSET %d`, pagination.Limit.Int64, pagination.Offset)
	}

	err := postgresRepository.Database.QueryRowx(countQuery, countArgs...).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	entities := []constant.HomeworkDetailEntity{}
	err = postgresRepository.Database.Select(&entities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, err
}
