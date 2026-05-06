package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) BestStudentList(pagination *helper.Pagination, filter *constant.BestStudentListFilter) ([]constant.BestStudentEntity, error) {
	query := `
		SELECT * FROM (
		WITH play_logs AS (
			SELECT
				"s"."user_id",
				"lpl"."level_id",
				MAX("lpl"."star") AS "max_stars",
				"lpl"."class_id"
			FROM "user"."student" s
			LEFT JOIN "level"."level_play_log" lpl ON "s"."user_id" = "lpl"."student_id"
	`
	args := []interface{}{}
	argsIndex := len(args) + 1

	if filter.StartDate != nil {
		query += fmt.Sprintf(` AND "lpl"."played_at" >= $%d`, argsIndex)
		args = append(args, filter.StartDate)
		argsIndex += 1
	}
	if filter.EndDate != nil {
		query += fmt.Sprintf(` AND "lpl"."played_at" <= $%d`, argsIndex)
		args = append(args, filter.EndDate)
		argsIndex += 1
	}

	query += `
			WHERE TRUE 
			GROUP BY "s"."user_id", "lpl"."level_id", "lpl"."class_id"
		),
		group_play_logs AS (
			SELECT
				"user_id",
				"class_id",
				COALESCE(COUNT("level_id"), 0) AS "levels",
				COALESCE(SUM("max_stars"), 0) AS "stars"
			FROM "play_logs"
			GROUP BY "user_id", "class_id"
		),
		classes AS (
			SELECT
        		*,
        		ROW_NUMBER() OVER (PARTITION BY "cs"."student_id" ORDER BY "c"."academic_year" DESC, "c"."year" DESC) AS rn
    		FROM "group_play_logs" gpl
			LEFT JOIN "school"."class_student" cs ON "gpl"."user_id" = "cs"."student_id"
    		LEFT JOIN "class"."class" c ON "cs"."class_id" = "c"."id"
		)
		SELECT
			"sc"."code" AS "school_code",
			"sc"."name" AS "school_name",
			"s"."student_id",
			"u"."title" AS "student_title",
			"u"."first_name" AS "student_first_name",
			"u"."last_name" AS "student_last_name",
			"c"."academic_year",
			"c"."year",
			"c"."name" AS "class_name",
			"gpl"."levels",
			"gpl"."stars"
		FROM "group_play_logs" gpl
		LEFT JOIN "user"."student" s ON "gpl"."user_id" = "s"."user_id"
		LEFT JOIN "school"."school" sc ON "s"."school_id" = "sc"."id"
		LEFT JOIN "user"."user" u ON "s"."user_id" = "u"."id"
		LEFT JOIN "classes" c ON "c"."student_id" = "u"."id" AND "c"."rn" = 1 AND "gpl"."class_id" = "c"."id"
		)
	`

	if filter.OrderBy == 1 {
		query += ` ORDER BY "levels" DESC, "student_title", "student_first_name", "student_last_name"`
	}
	if filter.OrderBy == 2 {
		query += ` ORDER BY "stars" DESC, "student_title", "student_first_name", "student_last_name"`
	}

	if pagination != nil {
		query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	bestStudents := []constant.BestStudentEntity{}
	err := postgresRepository.Database.Select(&bestStudents, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return bestStudents, nil
}
