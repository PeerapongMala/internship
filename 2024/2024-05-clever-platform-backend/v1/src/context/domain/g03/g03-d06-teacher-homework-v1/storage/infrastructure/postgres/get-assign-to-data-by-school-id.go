package postgres

import (
	"log"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetAssignToDataBySchoolId(schoolId int, teacherId string, subjectId int) ([]constant.AssignToDataEntity, error) {

	query := `
		WITH "current_academic_year" AS (
			SELECT
				"name" AS "current"
			FROM
		    	"school"."academic_year_range" ayr
			WHERE "ayr"."school_id" = $2
				AND $4 BETWEEN "ayr"."start_date" AND "ayr"."end_date"
				ORDER BY "name" DESC LIMIT 1
		)
		SELECT DISTINCT ON ("c"."id", "sg"."id")
		    "sy"."id" AS "seed_year_id",
    		"c"."year" AS "seed_year_short_name",
    		"c"."id" AS "class_id",
    		"c"."name" AS "class_name",
    		"sg"."id" AS "study_group_id",
			"sg"."name" AS "study_group_name"
		FROM "class"."class" c
		INNER JOIN "curriculum_group"."seed_year" sy ON "c"."year" = "sy"."short_name"
		LEFT JOIN "school"."class_student" cs ON "c"."id" = "cs"."class_id"
		INNER JOIN "school"."school_teacher" sct ON "c"."school_id" = "sct"."school_id"
		INNER JOIN "current_academic_year" cay ON "cay"."current"::integer = "c"."academic_year"
		LEFT JOIN "class"."study_group" sg ON "c"."id" = "sg"."class_id" AND "sg"."status" = 'enabled' AND "sg"."subject_id" = $3
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

	entities := []constant.AssignToDataEntity{}
	err := postgresRepository.Database.Select(&entities, query, teacherId, schoolId, subjectId, time.Now().UTC())
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}
