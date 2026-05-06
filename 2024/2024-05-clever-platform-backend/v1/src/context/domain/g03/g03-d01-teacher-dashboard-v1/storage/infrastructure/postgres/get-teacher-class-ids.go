package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
)

func (postgresRepository *postgresRepository) GetTeacherClassIds(schoolId int, teacherId string, filter *constant.ClassFilter) (classIds []int, err error) {
	classIds = []int{}
	query := `
		SELECT
    		"c"."id" AS "class_id"
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
	`
	args := []interface{}{teacherId}
	argsIndex := len(args) + 1

	if filter != nil && len(filter.AcademicYears) > 0 {
		query += fmt.Sprintf(` AND "c"."academic_year" = ANY($%d)`, argsIndex)
		args = append(args, filter.AcademicYears)
		argsIndex++
	}

	if filter != nil && len(filter.Years) > 0 {
		query += fmt.Sprintf(` AND "c"."year" = ANY($%d)`, argsIndex)
		args = append(args, filter.Years)
		argsIndex++
	}
	query += ` GROUP BY "c"."id", "c"."year", "c"."name", "c"."academic_year" ORDER BY c.name ASC`

	err = postgresRepository.Database.Select(&classIds, query, args...)
	if err != nil {
		return nil, err
	}
	return classIds, nil
}
