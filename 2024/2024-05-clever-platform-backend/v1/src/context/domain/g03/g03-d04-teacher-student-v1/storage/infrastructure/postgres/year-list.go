package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresTeacherStudentRepository *postgresTeacherStudentRepository) YearList(pagination *helper.Pagination, teacherId string) ([]string, error) {
	query := `
		SELECT DISTINCT ON ("c"."year")
    		"c"."year"
		FROM "class"."class" c
		LEFT JOIN "school"."class_student" cs ON "c"."id" = "cs"."class_id"
		INNER JOIN "school"."school_teacher" sct ON "c"."school_id" = "sct"."school_id"
		WHERE
    		"c"."status" = 'enabled'
    		AND "sct"."user_id" = $1
		  	AND (
    		 	EXISTS (
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
		  	        WHERE "ct"."class_id" = "c"."id"
		  	        AND "ct"."teacher_id" = $1
		  	    )
			)
	`
	args := []interface{}{teacherId}
	argsIndex := len(args) + 1

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresTeacherStudentRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY c.year OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	years := []string{}
	err := postgresTeacherStudentRepository.Database.Select(&years, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return years, nil
}
