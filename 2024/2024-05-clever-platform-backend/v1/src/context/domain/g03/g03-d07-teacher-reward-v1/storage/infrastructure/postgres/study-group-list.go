package postgres

import (
	"fmt"
	"github.com/pkg/errors"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) StudyGroupList(teacherId string, classId int, pagination *helper.Pagination) ([]constant.StudyGroup, error) {
	query := `
			SELECT DISTINCT ON ("sg"."id")
			    "sg"."id", 
				"sg"."name",
				"c"."year",
				"c"."name" AS "class"
			FROM "subject"."subject_teacher" st
			INNER JOIN "subject"."subject" s ON "st"."subject_id" = "s"."id"
			INNER JOIN "curriculum_group"."subject_group" sjg ON "s"."subject_group_id" = "sjg"."id"
			INNER JOIN "curriculum_group"."year" y ON "sjg"."year_id" = "y"."id"
			INNER JOIN "curriculum_group"."seed_year" sy ON "y"."seed_year_id" = "sy"."id"
			INNER JOIN "school"."class_teacher"  ct ON "ct"."teacher_id" = $1
			INNER JOIN "class"."class" c ON "sy"."short_name" = "c"."year" AND "ct"."class_id" = "c"."id"
			INNER JOIN "school"."school_teacher" sct ON "c"."school_id" = "sct"."school_id" 
			INNER JOIN "class"."study_group" sg ON "c"."id" = "sg"."class_id"
			WHERE	
				"st"."teacher_id" = $1 AND "sct"."user_id" = $1 AND "c"."status" = 'enabled' AND "sg"."status" = 'enabled'
	`
	args := []interface{}{teacherId}
	argsIndex := len(args) + 1

	if classId != 0 {
		query += fmt.Sprintf(` AND "c"."id" = $%d`, argsIndex)
		args = append(args, classId)
		argsIndex++
	}

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
		query += fmt.Sprintf(` ORDER BY sg.id OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	response := []constant.StudyGroup{}
	err := postgresRepository.Database.Select(&response, query, args...)
	if err != nil {
		return nil, err

	}
	return response, nil
}
