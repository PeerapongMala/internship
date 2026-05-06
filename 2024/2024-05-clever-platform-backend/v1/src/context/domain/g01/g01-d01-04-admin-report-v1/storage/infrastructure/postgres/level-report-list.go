package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) LevelReportList(pagination *helper.Pagination, filter *constant.LevelReportFilter) ([]constant.LevelReportEntity, error) {
	query := `
		WITH "best_play" AS (
		    SELECT
		        "lpl"."student_id",
		        "lpl"."level_id",
		        COALESCE(MAX("lpl"."star"), 0) AS "score",
		    	COALESCE(COUNT("lpl"."id"), 0) AS "attempts",
		    	MAX("lpl"."played_at") AS "last_play_at"
		    FROM
		        "level"."level_play_log" lpl
		    LEFT JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
		    LEFT JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
		    WHERE
		        "lpl"."student_id" = $1
		      	AND "lpl"."class_id" = $2
				AND "sl"."id" = $3
	`
	args := []interface{}{filter.UserId, filter.ClassId, filter.SubLessonId}
	argsIndex := len(args) + 1

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

	query += `
		GROUP BY 
				"lpl"."level_id", "lpl"."student_id"
		),
	`

	query += `
		level_play_log AS (
				SELECT
					"lpl"."student_id",
					"lpl"."level_id",
					"lpl"."id"
				FROM "level"."level_play_log" lpl
				INNER JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
		    	INNER JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
		    	WHERE
		    	    "lpl"."student_id" = $1
		    	    AND "lpl"."class_id" = $2
					AND "sl"."id" = $3
		),
		"avg_time" AS (
				SELECT
					"l"."id" AS "level_id", 
					COALESCE(AVG("qpl"."time_used"), 0) AS "avg_time_used"
				FROM
					"level_play_log" lpl
				INNER JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
				LEFT JOIN "question"."question_play_log" qpl ON "lpl"."id" = "qpl"."level_play_log_id"
				GROUP BY "l"."id"
		)
        SELECT
        		"l"."id" AS "level_id",
				"l"."index" AS "level_index",
				"l"."level_type" AS "level_type",
				"l"."question_type" AS "question_type",
				"l"."difficulty" AS "difficulty",
				COALESCE(SUM("bp"."score"), 0) AS "score",
				3 AS "total_score",
				COALESCE(SUM("bp"."attempts"), 0) AS "play_count",	
				COALESCE("at"."avg_time_used", 0) AS "average_time_used",
				MAX("bp"."last_play_at") AS "last_played",
				COUNT(*) OVER() AS "total_count"
            FROM
                "subject"."sub_lesson" sl
        	LEFT JOIN "level"."level" l ON "sl"."id" = "l"."sub_lesson_id"
			LEFT JOIN "best_play" AS "bp" ON "l"."id" = "bp"."level_id"
            LEFT JOIN "avg_time" at ON "l"."id" = "at"."level_id"
            WHERE
                "sl"."id" = $3
	`

	if filter.LevelIndex != 0 {
		query += fmt.Sprintf(` AND "l"."index" = $%d`, argsIndex)
		args = append(args, filter.LevelIndex)
		argsIndex++
	}
	if filter.LevelType != "" {
		query += fmt.Sprintf(` AND "l"."level_type" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.LevelType+"%")
		argsIndex++
	}
	if filter.QuestionType != "" {
		query += fmt.Sprintf(` AND "l"."question_type" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.QuestionType+"%")
		argsIndex++
	}
	if filter.Difficulty != "" {
		query += fmt.Sprintf(` AND "l"."difficulty" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Difficulty+"%")
		argsIndex++
	}

	query += `
		GROUP BY "l"."id", "at"."avg_time_used"
	`

	if pagination != nil {
		query += fmt.Sprintf(` ORDER BY "l"."index" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	levelReportEntities := []constant.LevelReportEntity{}
	err := postgresRepository.Database.Select(&levelReportEntities, query, args...)
	if err != nil {
		return nil, err
	}

	if len(levelReportEntities) > 0 {
		helper.DerefPagination(pagination).TotalCount = levelReportEntities[0].TotalCount
	}

	return levelReportEntities, nil

}
