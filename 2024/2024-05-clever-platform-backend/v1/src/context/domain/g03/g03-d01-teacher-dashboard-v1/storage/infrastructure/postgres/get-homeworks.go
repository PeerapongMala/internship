package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
)

func (postgresRepository postgresRepository) GetHomeworks(filter *constant.HomeworkFilter) (entities []constant.HomeworkEntity, err error) {
	query := `
		WITH "school" AS (
			SELECT
				"school_id"
			FROM "school"."school_teacher" st
			WHERE "st"."user_id" = $3
		)
		SELECT
			"h"."id",
			"h"."name",
			"h"."subject_id",
			"h"."year_id",
			"h"."homework_template_id",
			"h"."started_at",
			"h"."due_at",
			"h"."closed_at",
			"h"."status",
			"h"."created_at",
			"h"."created_by",
			"h"."updated_at",
			"h"."updated_by",
			"h"."admin_login_as"
		FROM
			"homework"."homework" h
			    INNER JOIN "homework"."homework_template" ht ON "h"."homework_template_id" = "ht"."id"
			    INNER JOIN "school"."school_teacher" st ON "ht"."teacher_id" = "st"."user_id"
				LEFT JOIN "homework"."homework_assigned_to_class" hatc ON "h"."id" = "hatc"."homework_id"
				LEFT JOIN "homework"."homework_assigned_to_year" haty ON "h"."id" = "haty"."homework_id"
				LEFT JOIN "homework"."homework_assigned_to_study_group" hatsgs ON "h"."id" = "hatsgs"."homework_id"
				LEFT JOIN "curriculum_group"."seed_year" sy ON "haty"."seed_year_id" = "sy"."id" 
				INNER JOIN "school" s ON "st"."school_id" = s.school_id
		WHERE
			 ("hatc"."class_id" = ANY($1)
			OR "sy"."short_name" = $2)
	`

	args := []interface{}{filter.ClassIds, filter.Year, filter.TeacherId}
	argsIndex := len(args) + 1

	//if len(filter.ClassIds) > 0 {
	//	query += fmt.Sprintf(` AND "homework"."homework_assigned_to_class"."class_id" = ANY($%d)`, argsIndex)
	//	args = append(args, filter.ClassIds)
	//	argsIndex++
	//}
	if filter.LessonId != 0 {
		query += fmt.Sprintf(` AND "ht"."lesson_id" = $%d`, argsIndex)
		args = append(args, filter.LessonId)
		argsIndex++
	}
	if filter.StartDate != nil {
		query += fmt.Sprintf(` AND "h"."started_at" >= $%d`, argsIndex)
		args = append(args, filter.StartDate)
		argsIndex++
	}
	if filter.EndDate != nil {
		query += fmt.Sprintf(` AND "h"."closed_at" <= $%d`, argsIndex)
		args = append(args, filter.EndDate)
		argsIndex++
	}
	if len(filter.StudyGroupIds) > 0 {
		fmt.Println(filter.StudyGroupIds)
		query += fmt.Sprintf(` AND hatsgs.study_group_id = ANY($%d)`, argsIndex)
		args = append(args, filter.StudyGroupIds)
		argsIndex++
	}

	query += ` ORDER BY "h"."created_at" DESC`

	if filter.Limit != nil {
		query += ` LIMIT 1`
	}

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		entity := constant.HomeworkEntity{}
		err = rows.StructScan(&entity)
		if err != nil {
			return
		}
		entities = append(entities, entity)
	}
	return
}
