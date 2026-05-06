package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ClassReportList(pagination *helper.Pagination, filter *constant.ClassReportFilter) ([]constant.ClassReportEntity, error) {
	query := `
		WITH "target_class" AS (
		    SELECT
		        "c"."id",
		        "c"."academic_year",
		        "c"."year",
		        "c"."name"
			FROM "class"."class" c
			WHERE "c"."school_id" = $1
		),
		"best_play" AS (
		    SELECT
		        "lpl"."student_id",
		        "lpl"."level_id",
				"lpl"."class_id",
		        COALESCE(MAX("lpl"."star"), 0) AS "max_stars",
		    	COALESCE(COUNT("lpl"."id"), 0) AS "attempts"
		    FROM "target_class" tc
		    LEFT JOIN "level"."level_play_log" lpl ON "tc"."id" = "lpl"."class_id"
	`
	args := []interface{}{filter.SchoolId}
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
		    	"lpl"."student_id", "lpl"."level_id", "lpl"."class_id"
		),
		"class_stat" AS (
			SELECT
				"bp"."class_id",
				SUM(bp.max_stars) AS total_stars,
				COUNT(bp.level_id) AS total_levels
			FROM "best_play" bp 
		    WHERE
				"bp"."max_stars" > 0
			GROUP BY "bp"."class_id"
		),
		"play_count" AS (
			SELECT
				"bp"."class_id",
				SUM(bp.attempts) AS play_count
			FROM "best_play" bp 
			GROUP BY "bp"."class_id"
		),
		class_student_count AS (
			SELECT
				"tc"."id" AS "class_id",
				COUNT("cs"."student_id") AS "student_count"
			FROM "target_class" tc
			LEFT JOIN "school"."class_student" cs ON "tc"."id" = "cs"."class_id"
			GROUP BY "tc"."id"
		),
		active_student_count AS (
			SELECT
				"bp"."class_id",
				COUNT(DISTINCT "bp"."student_id") AS "active_student_count"
			FROM "best_play" bp 
			GROUP BY "bp"."class_id"
		),
	`

	query += `
		"avg_time" AS (
			SELECT
				"lpl"."class_id", 
				COALESCE(AVG("qpl"."time_used"), 0) AS "avg_time_used"
			FROM "target_class" tc 
			LEFT JOIN "level"."level_play_log" lpl ON "tc"."id" = "lpl"."class_id"
			LEFT JOIN "question"."question_play_log" qpl ON "lpl"."id" = "qpl"."level_play_log_id"
	`
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
			GROUP BY "lpl"."class_id"
		)
		SELECT
		    "tc"."id" AS "class_id",
		    "tc"."academic_year",
		    "tc"."year" AS "class_year",
		    "tc"."name" AS "class_name",
		    COALESCE("csc"."student_count", 0) AS "student_count",
			COALESCE("ac"."active_student_count", 0) AS "active_student_count",
		    COALESCE("cs"."total_stars", 0) AS "average_score",
		    COALESCE("cs"."total_levels", 0) AS "average_passed_levels",
		    COALESCE("pc"."play_count", 0) AS "play_count",
		   	COALESCE("at"."avg_time_used", 0) AS "average_time_used", 
			COUNT(*) OVER() AS "total_count"
		FROM "target_class" tc
		LEFT JOIN "class_stat" cs ON "tc"."id" = "cs"."class_id"
		LEFT JOIN "class_student_count" csc ON "csc"."class_id" = "tc"."id"
		LEFT JOIN "active_student_count" ac ON "tc"."id" = "ac"."class_id"
		LEFT JOIN "play_count" pc ON "tc"."id" = "pc"."class_id"
		LEFT JOIN "avg_time" at ON "tc"."id" = "at"."class_id"
	`
	if filter.ClassName != "" {
		query += fmt.Sprintf(` AND "tc"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.ClassName+"%")
		argsIndex++
	}
	if filter.Year != "" {
		query += fmt.Sprintf(` AND "tc"."year" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Year+"%")
		argsIndex++
	}
	if filter.AcademicYear != "" {
		query += fmt.Sprintf(` AND "tc"."academic_year"::TEXT ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.AcademicYear+"%")
		argsIndex++
	}

	if pagination != nil {
		query += fmt.Sprintf(` ORDER BY "tc"."academic_year" DESC, "tc"."name" ASC OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	classReportEntities := []constant.ClassReportEntity{}
	err := postgresRepository.Database.Select(&classReportEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if len(classReportEntities) > 0 {
		helper.DerefPagination(pagination).TotalCount = classReportEntities[0].TotalCount
	}

	return classReportEntities, nil
}
