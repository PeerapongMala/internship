package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LevelList(classId, subLessonId int, filter constant.LevelFilter, pagination *helper.Pagination) ([]constant.LevelEntity, error) {
	query := `
		SELECT
			"l"."id",
			"l"."index" AS "level_index",
			"l"."level_type" AS "level_type",
			"l"."question_type",
			"l"."difficulty",
			SUM(CASE WHEN "q"."id" IS NOT NULL THEN 1 ELSE 0 END) AS "question_count"
		FROM
			"school"."school_sub_lesson" ssl
		INNER JOIN
			"level"."level" l
			ON "ssl"."sub_lesson_id" = "l"."sub_lesson_id"
		LEFT JOIN
			"question"."question" q
			ON "q"."level_id" = "l"."id"
		WHERE
			"ssl"."class_id" = $1	
			AND
			"ssl"."sub_lesson_id" = $2
			AND "l"."status" = 'enabled'	
	`
	args := []interface{}{classId, subLessonId}
	argsIndex := 3

	if filter.LevelType != "" {
		query += fmt.Sprintf(` AND "l"."level_type" = $%d`, argsIndex)
		args = append(args, filter.LevelType)
		argsIndex++
	}
	if filter.QuestionType != "" {
		query += fmt.Sprintf(` AND "l"."question_type" = $%d`, argsIndex)
		args = append(args, filter.QuestionType)
		argsIndex++
	}
	if filter.Difficulty != "" {
		query += fmt.Sprintf(` AND "l"."difficulty" = $%d`, argsIndex)
		args = append(args, filter.Difficulty)
		argsIndex++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "l"."status" = $%d`, argsIndex)
		args = append(args, filter.Status)
		argsIndex++
	}
	if filter.LevelId != 0 {
		query += fmt.Sprintf(` AND "l"."id" = $%d`, argsIndex)
		args = append(args, filter.LevelId)
		argsIndex++
	}
	if filter.LevelIndex != 0 {
		query += fmt.Sprintf(` AND "l"."index" = $%d`, argsIndex)
		args = append(args, filter.LevelIndex)
		argsIndex++
	}

	query += fmt.Sprintf(`
			GROUP BY
    			"l"."id",
    			"l"."index",
    			"l"."level_type",
    			"l"."question_type",
    			"l"."difficulty"
	`)
	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "l"."index" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	levelEntities := []constant.LevelEntity{}
	err := postgresRepository.Database.Select(&levelEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return levelEntities, nil
}
