package postgres

import (
	"fmt"
	"github.com/pkg/errors"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) ClassList(teacherId string, year string, academicYear int, pagination *helper.Pagination) ([]constant.Class, error) {
	query := `
		SELECT
    		"c"."id" AS "class_id",
    		"c"."year" AS "class_year",
    		"c"."name" AS "class_name",
    		"c"."academic_year" AS "class_academic_year",
    		COUNT(DISTINCT "cs"."student_id") AS "student_count"
		FROM "class"."class" c
		LEFT JOIN "school"."class_student" cs ON "c"."id" = "cs"."class_id"
		INNER JOIN "school"."school_teacher" sct ON "c"."school_id" = "sct"."school_id"
		WHERE
    		"c"."status" = 'enabled'
    		AND "sct"."user_id" = $1
    		AND EXISTS (
        		SELECT 1 FROM "subject"."subject_teacher" st
        			INNER JOIN "subject"."subject" s ON "st"."subject_id" = "s"."id"
        			INNER JOIN "curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"
        			INNER JOIN "curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
        			INNER JOIN "curriculum_group"."seed_year" sy ON "y"."seed_year_id" = "sy"."id"
        			WHERE "st"."teacher_id" = $1
        				AND "sy"."short_name" = "c"."year"
    		)
			AND EXISTS (
				SELECT 1 FROM "school"."class_teacher" ct
				WHERE "ct"."class_id" = "c"."id" AND "ct"."teacher_id" = $1
			)
	`
	args := []interface{}{teacherId}
	argsIndex := len(args) + 1

	if year != "" {
		query += fmt.Sprintf(` AND "c"."year" = $%d`, argsIndex)
		args = append(args, year)
		argsIndex++
	}
	if academicYear != 0 {
		query += fmt.Sprintf(` AND "c"."academic_year" = $%d`, argsIndex)
		args = append(args, academicYear)
		argsIndex++
	}

	query += ` GROUP BY "c"."id", "c"."year", "c"."name", "c"."academic_year"`
	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY c.id OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	response := []constant.Class{}
	err := postgresRepository.Database.Select(&response, query, args...)
	if err != nil {
		return nil, err

	}
	return response, nil
}
