package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ClassList(filter *constant.ClassFilter, pagination *helper.Pagination) ([]constant.ClassEntity, error) {
	query := `
  		WITH "school_id" AS (
			SELECT
				"st"."school_id"
			FROM		
			    "school"."school_teacher" st
			WHERE "st"."user_id" = $1
			LIMIT 1
		)
		SELECT
    		"c"."id",
    		"c"."name",
		    "c"."academic_year",
    		"c"."year",
    		"c"."updated_at",
    		"c"."updated_by"
		FROM
    		"class"."class" c
		WHERE
		(
    		EXISTS (
        		SELECT 1 FROM "school"."class_teacher" ct
        		WHERE "ct"."class_id" = "c"."id" AND "ct"."teacher_id" = $1
    		)
    		AND EXISTS (
        		SELECT 1 FROM "subject"."subject_teacher" st
        			JOIN "subject"."subject" s ON "st"."subject_id" = "s"."id"
        			JOIN "curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"
        			JOIN "curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
        			JOIN "curriculum_group"."seed_year" sy ON "y"."seed_year_id" = "sy"."id"
        		WHERE "st"."academic_year" = "c"."academic_year"
         			AND "st"."teacher_id" = $1
          			AND "c"."year" = "sy"."short_name"
			)
		)
  		AND "c"."school_id" = (SELECT "school_id" FROM "school_id") 
	`
	args := []interface{}{filter.TeacherId}
	argsIndex := 2

	if filter.AcademicYear != 0 {
		query += fmt.Sprintf(` AND "c"."academic_year" = $%d`, argsIndex)
		args = append(args, filter.AcademicYear)
		argsIndex++
	}
	if filter.Id != 0 {
		query += fmt.Sprintf(` AND "c"."id" = $%d`, argsIndex)
		args = append(args, filter.Id)
		argsIndex++
	}
	if filter.Name != "" {
		query += fmt.Sprintf(` AND "c"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Name+"%")
		argsIndex++
	}
	if filter.Year != "" {
		query += fmt.Sprintf(` AND "c"."year" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Year+"%")
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "c"."academic_year" DESC, "c"."year" DESC, "c"."name" DESC OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	classEntities := []constant.ClassEntity{}
	err := postgresRepository.Database.Select(&classEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return classEntities, nil
}
