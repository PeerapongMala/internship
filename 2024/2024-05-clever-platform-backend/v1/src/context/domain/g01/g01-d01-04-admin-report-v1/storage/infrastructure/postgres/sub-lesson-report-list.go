package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubLessonReportList(pagination *helper.Pagination, filter *constant.SubLessonReportFilter) ([]constant.SubLessonReportEntity, error) {
	query := `
		WITH "best_play" AS (
		    SELECT
		        "lpl"."student_id",
		        "lpl"."level_id",
		        "sl"."id" AS "sub_lesson_id",
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
				AND "sl"."lesson_id" = $3
	`
	args := []interface{}{filter.UserId, filter.ClassId, filter.LessonId}
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
		    "sl"."id", "lpl"."student_id", "lpl"."level_id"
		),
		"level_counts" AS (
		    SELECT
				"sl"."id" AS "sub_lesson_id",
				COUNT(*) AS "total_levels_count" 
			FROM "subject"."lesson" ls 
			INNER JOIN "subject"."sub_lesson" sl ON "ls"."id" = "sl"."lesson_id"
			INNER JOIN "level"."level" l ON "sl"."id" = "l"."sub_lesson_id"
			WHERE
				"ls"."id" = $3
			GROUP BY "sl"."id"
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
					AND "sl"."lesson_id" = $3 
		),
		"avg_time" AS (
				SELECT
					"sl"."id" AS "sub_lesson_id", 
					COALESCE(AVG("qpl"."time_used"), 0) AS "avg_time_used"
				FROM
					"level_play_log" lpl
				INNER JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
				INNER JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
				LEFT JOIN "question"."question_play_log" qpl ON "lpl"."id" = "qpl"."level_play_log_id"
				GROUP BY "sl"."id"
		)
	  		SELECT
	  	    		"sl"."id" AS "sub_lesson_id",	
	  	    		"sl"."name" AS "sub_lesson_name",	
	  	    		"sl"."index" AS "sub_lesson_index",
					MAX("bp"."last_play_at") AS "last_played",
					COALESCE(SUM("bp"."attempts"), 0) AS "play_count",
					COUNT("bp"."level_id") FILTER (WHERE "bp"."score" > 0) AS "passed_level_count",  
					COALESCE("lc"."total_levels_count", 0) AS "total_level_count",
					COALESCE(SUM("bp"."score"), 0) AS "score",
					COALESCE("lc"."total_levels_count" * 3, 0) AS "total_score",
					COALESCE(SUM("bp"."attempts"), 0) AS "play_count",
					COALESCE("at"."avg_time_used", 0) AS "average_time_used",
					COUNT(*) OVER() AS "total_count"
            FROM
                "subject"."sub_lesson" sl
            LEFT JOIN "level_counts" AS "lc" ON "sl"."id" = "lc"."sub_lesson_id"
			LEFT JOIN "best_play" AS "bp" ON "sl"."id" = "bp"."sub_lesson_id"
            LEFT JOIN "subject"."lesson" ls ON "sl"."lesson_id" = "ls"."id"
            LEFT JOIN "subject"."subject" s ON "ls"."subject_id" = "s"."id"
            LEFT JOIN "avg_time" at ON "sl"."id" = "at"."sub_lesson_id"
            LEFT JOIN "curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"
            LEFT JOIN "curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
            LEFT JOIN "curriculum_group"."platform" p ON "y"."platform_id" = "p"."id"
            LEFT JOIN "curriculum_group"."curriculum_group" cg ON "p"."curriculum_group_id" = "cg"."id"
            WHERE
                "sl"."lesson_id" = $3
	 `

	if filter.LessonId != 0 {
		query += fmt.Sprintf(` AND "ls"."id" = $%d`, argsIndex)
		args = append(args, filter.LessonId)
		argsIndex++
	}
	if filter.SubLessonId != 0 {
		query += fmt.Sprintf(` AND "sl"."id" = $%d`, argsIndex)
		args = append(args, filter.SubLessonId)
		argsIndex++
	}
	if filter.SubLessonName != "" {
		query += fmt.Sprintf(` AND "sl"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.SubLessonName+"%")
		argsIndex++
	}

	query += `
		GROUP BY "sl"."id", "lc"."total_levels_count", "cg"."short_name", "s"."name", "s"."id", "at"."avg_time_used"
	`

	if pagination != nil {
		query += fmt.Sprintf(` ORDER BY "sl"."index" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	subLessonReportEntities := []constant.SubLessonReportEntity{}
	err := postgresRepository.Database.Select(&subLessonReportEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if len(subLessonReportEntities) > 0 {
		helper.DerefPagination(pagination).TotalCount = subLessonReportEntities[0].TotalCount
	}

	return subLessonReportEntities, nil

}
