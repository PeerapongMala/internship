package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) StudentReportList(pagination *helper.Pagination, filter *constant.StudentReportFilter) ([]constant.StudentReportEntity, error) {
	query := `
		WITH "best_play" AS (
		    SELECT
		        "lpl"."student_id",
		        "lpl"."level_id",
		        COALESCE(MAX("lpl"."star"), 0) AS "score",
		    	COALESCE(COUNT("lpl"."id"), 0) AS "attempts"
		    FROM
		        "level"."level_play_log" lpl
		    LEFT JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
		    LEFT JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
		    WHERE
		        "lpl"."class_id" = $1
				AND "sl"."lesson_id" = ANY($2)
				
	`
	args := []interface{}{filter.ClassId, filter.ClassLessonIds}
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
		    	"lpl"."student_id", "lpl"."level_id"
		),
		"level_counts" AS (
			SELECT
				COUNT(*) AS "total_levels_count"
			FROM "subject"."lesson" ls 
			INNER JOIN "subject"."sub_lesson" sl ON "ls"."id" = "sl"."lesson_id"
			INNER JOIN "level"."level" l ON "sl"."id" = "l"."sub_lesson_id"
			WHERE
				"ls"."id" = ANY($2)
		),
		`

	query += `
		level_play_log AS (
				SELECT
					"lpl"."student_id",
					"lpl"."id"
				FROM "level"."level_play_log" lpl
				INNER JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
		    	INNER JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
		    	WHERE
		    	    "lpl"."class_id" = $1
					AND "sl"."lesson_id" = ANY($2)
		),
		"avg_time" AS (
				SELECT
					"lpl"."student_id", 
					COALESCE(AVG("qpl"."time_used"), 0) AS "avg_time_used"
				FROM
					"level_play_log" lpl
				LEFT JOIN "question"."question_play_log" qpl ON "lpl"."id" = "qpl"."level_play_log_id"
				GROUP BY "lpl"."student_id"
		)
		SELECT
		    "u"."id" AS "user_id",
		    "s"."student_id",
		    "u"."title",
		    "u"."first_name",
		    "u"."last_name",
		   	COUNT("bp"."level_id") FILTER (WHERE "bp"."score" > 0) AS "passed_level_count",  
			COALESCE("lc"."total_levels_count", 0) AS "total_levels_count",
		    COALESCE("at"."avg_time_used", 0) AS "average_time_used",
		    COALESCE(SUM("bp"."score"), 0) AS "score",
		    COALESCE("lc"."total_levels_count" * 3, 0) AS "total_score",
		    COALESCE(SUM("bp"."attempts"), 0) AS "play_count",
		    "u"."last_login",
			COUNT(*) OVER() AS "total_count"
		FROM
		    "school"."class_student" cs
		LEFT JOIN "user"."student" s ON "cs"."student_id" = "s"."user_id"
		LEFT JOIN "user"."user" u ON "s"."user_id" = "u"."id"
		LEFT JOIN "level_counts" AS "lc" ON TRUE
		LEFT JOIN "avg_time" AS "at" ON "u"."id" = "at"."student_id"
		LEFT JOIN "best_play" AS "bp" ON "u"."id" = "bp"."student_id"
		WHERE
		    "cs"."class_id" = $1
		`

	if filter.StudentId != "" {
		query += fmt.Sprintf(` AND "s"."student_id" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.StudentId+"%")
		argsIndex++
	}
	if filter.Title != "" {
		query += fmt.Sprintf(` AND "u"."title" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Title+"%")
		argsIndex++
	}
	if filter.FirstName != "" {
		query += fmt.Sprintf(` AND "u"."first_name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.FirstName+"%")
		argsIndex++
	}
	if filter.LastName != "" {
		query += fmt.Sprintf(` AND "u"."last_name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.LastName+"%")
		argsIndex++
	}

	query += `
		GROUP BY "u"."id", "s"."user_id", "s"."student_id", "lc"."total_levels_count", "at"."avg_time_used"
	`
	if pagination != nil {
		query += fmt.Sprintf(` ORDER BY "s"."user_id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	studentReportEntities := []constant.StudentReportEntity{}
	err := postgresRepository.Database.Select(&studentReportEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if len(studentReportEntities) > 0 {
		helper.DerefPagination(pagination).TotalCount = studentReportEntities[0].TotalCount
	}

	return studentReportEntities, nil
}
