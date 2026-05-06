package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LessonReportList(pagination *helper.Pagination, filter *constant.LessonReportFilter) ([]constant.LessonReportEntity, error) {
	query := `
		WITH "best_play" AS (
		    SELECT
		        "lpl"."student_id",
		        "lpl"."level_id",
		        "sl"."lesson_id",
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
				AND "sl"."lesson_id" = ANY($3)
	`
	args := []interface{}{filter.UserId, filter.ClassId, filter.ClassLessonIds}
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
		        "sl"."lesson_id",
		        "lpl"."student_id",
				"lpl"."level_id"
		),
		"level_counts" AS (
		    SELECT
				"ls"."id" AS "lesson_id",
				COUNT(*) AS "total_levels_count" 
			FROM "subject"."lesson" ls 
			INNER JOIN "subject"."sub_lesson" sl ON "ls"."id" = "sl"."lesson_id"
			INNER JOIN "level"."level" l ON "sl"."id" = "l"."sub_lesson_id"
			WHERE
				"ls"."id" = ANY($3)
			GROUP BY "ls"."id"
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
					AND "sl"."lesson_id" = ANY($3)
		),
		"avg_time" AS (
				SELECT
					"ls"."id" AS "lesson_id", 
					COALESCE(AVG("qpl"."time_used"), 0) AS "avg_time_used"
				FROM
					"level_play_log" lpl
				INNER JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
				INNER JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
				INNER JOIN "subject"."lesson" ls ON "sl"."lesson_id" = "ls"."id"
				LEFT JOIN "question"."question_play_log" qpl ON "lpl"."id" = "qpl"."level_play_log_id"
				GROUP BY "ls"."id"
		)
            SELECT
                "cg"."short_name" AS "curriculum_group_short_name",
                "s"."name" AS "subject",
                "ls"."id" AS "lesson_id",
                "ls"."index" AS "lesson_index",
                "ls"."name" AS "lesson_name",
                COUNT("bp"."level_id") FILTER (WHERE "bp"."score" > 0) AS "passed_level_count",
                COALESCE("lc"."total_levels_count", 0) AS "total_level_count",
                COALESCE("at"."avg_time_used", 0) AS "average_time_used",
            	COALESCE(SUM("bp"."attempts"), 0) AS "play_count",
                COALESCE(SUM("bp"."score"), 0) AS "score",
                COALESCE("lc"."total_levels_count" * 3, 0) AS "total_score",
                MAX("bp"."last_play_at") AS "last_login"
            FROM
                "subject"."lesson" ls
            LEFT JOIN "level_counts" AS "lc" ON "ls"."id" = "lc"."lesson_id"
			LEFT JOIN "best_play" AS "bp" ON "ls"."id" = "bp"."lesson_id"
            LEFT JOIN "subject"."subject" s ON "ls"."subject_id" = "s"."id"
            LEFT JOIN "avg_time" at ON "ls"."id" = "at"."lesson_id"
            LEFT JOIN "curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"
            LEFT JOIN "curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
            LEFT JOIN "curriculum_group"."platform" p ON "y"."platform_id" = "p"."id"
            LEFT JOIN "curriculum_group"."curriculum_group" cg ON "p"."curriculum_group_id" = "cg"."id"
            WHERE
                "ls"."id" = ANY($3)
    `

	if filter.LessonId != 0 {
		query += fmt.Sprintf(` AND "ls"."id" = $%d`, argsIndex)
		args = append(args, filter.LessonId)
		argsIndex++
	}
	if filter.LessonName != "" {
		query += fmt.Sprintf(` AND "ls"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.LessonName+"%")
		argsIndex++
	}
	if filter.SubjectId != 0 {
		query += fmt.Sprintf(` AND "s"."id" = $%d`, argsIndex)
		args = append(args, filter.SubjectId)
		argsIndex++
	}
	if filter.SubjectName != "" {
		query += fmt.Sprintf(` AND "s"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.SubjectName+"%")
		argsIndex++
	}
	if filter.CurriculumGroupId != 0 {
		query += fmt.Sprintf(` AND "cg"."id" = $%d`, argsIndex)
		args = append(args, filter.CurriculumGroupId)
		argsIndex++
	}
	if filter.CurriculumGroupName != "" {
		query += fmt.Sprintf(` AND "cg"."short_name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.CurriculumGroupName+"%")
		argsIndex++
	}

	query += `
		GROUP BY "ls"."id", "lc"."total_levels_count", "cg"."short_name", "s"."name", "s"."id", "at"."avg_time_used"
	`

	if pagination != nil {
		query += fmt.Sprintf(` ORDER BY "s"."id", "ls"."index" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	lessonReportEntities := []constant.LessonReportEntity{}
	err := postgresRepository.Database.Select(&lessonReportEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return lessonReportEntities, nil
}
