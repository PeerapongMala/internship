package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LevelPlayLogList(pagination *helper.Pagination, filter *constant.LevelPlayLogFilter) ([]constant.LevelPlayLogEntity, error) {
	query := `
		SELECT
	        ROW_NUMBER() OVER (ORDER BY "lpl"."played_at") AS "play_index",
	        "lpl"."id",
	        "lpl"."star" AS "score",
	        AVG("qpl"."time_used") AS "average_time_used",
	        "lpl"."played_at",
			COUNT(*) OVER() AS "total_count"
	    FROM "level"."level_play_log" lpl
	    LEFT JOIN "class"."class" c ON "lpl"."class_id" = "c"."id"
	    LEFT JOIN "question"."question_play_log" qpl ON "lpl"."id" = "qpl"."level_play_log_id"
	    WHERE 
	        "student_id" = $1
			AND "level_id" = $2
			AND "class_id" = $3
	`
	args := []interface{}{filter.UserId, filter.LevelId, filter.ClassId}
	argsIndex := len(args) + 1

	if filter.AcademicYear != 0 {
		query += fmt.Sprintf(` AND "c"."academic_year" = $%d`, argsIndex)
		args = append(args, filter.AcademicYear)
		argsIndex++
	}
	if filter.StartDate != nil {
		query += fmt.Sprintf(` AND "lpl"."played_at" >= $%d`, argsIndex)
		args = append(args, filter.StartDate)
		argsIndex++
	}
	if filter.EndDate != nil {
		query += fmt.Sprintf(` AND "lpl"."played_at" <= $%d`, argsIndex)
		args = append(args, filter.EndDate)
		argsIndex++
	}

	query += fmt.Sprintf(` GROUP BY "lpl"."id", "lpl"."played_at"`)

	if filter.PlayIndex != 0 {
		query = fmt.Sprintf(` 
			WITH plays AS (
				%s
			)
			SELECT
				*
			FROM
				"plays"
			WHERE
				"play_index" = $%d
		`, query, argsIndex)
		args = append(args, filter.PlayIndex)
		argsIndex++
	}

	if pagination != nil {
		query += fmt.Sprintf(` ORDER BY "play_index" DESC OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	levelPlayLogEntities := []constant.LevelPlayLogEntity{}
	err := postgresRepository.Database.Select(&levelPlayLogEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if len(levelPlayLogEntities) > 0 {
		helper.DerefPagination(pagination).TotalCount = levelPlayLogEntities[0].TotalCount
	}

	return levelPlayLogEntities, nil
}
