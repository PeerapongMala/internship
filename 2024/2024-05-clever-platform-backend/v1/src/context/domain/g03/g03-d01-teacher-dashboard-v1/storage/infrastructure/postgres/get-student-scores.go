package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository postgresRepository) GetStudentScores(classIds []int, studyGroupIds []int, lessonIds []int, pagination *helper.Pagination, sortDirection constant.SortDirection) (entities []constant.StudentScoreEntity, err error) {
	err = sortDirection.IsValid()
	if err != nil {
		return
	}

	args := []interface{}{}
	argsIndex := 1

	subQuery := `
		SELECT 
			"llpl"."student_id", "llpl"."level_id", MAX("llpl"."star") AS best_score
		FROM 
			"level"."level_play_log" as llpl
				LEFT JOIN "level"."level" ll
					ON "llpl"."level_id" = "ll"."id"
				LEFT JOIN "subject"."sub_lesson" ssl
					ON "ll"."sub_lesson_id" = "ssl"."id"
				LEFT JOIN "subject"."lesson" sl
					ON "ssl"."lesson_id" = "sl"."id"
	`
	if len(lessonIds) > 0 {
		subQuery += fmt.Sprintf(`WHERE "sl"."id" = ANY($%d)`, argsIndex)
		args = append(args, lessonIds)
		argsIndex++
	}
	subQuery += ` GROUP BY "llpl"."student_id", "llpl"."level_id"`

	mainQuery := fmt.Sprintf(`	
		SELECT
			CONCAT("uu"."first_name", ' ', "uu".last_name) AS full_name,
			"uu"."id",
			COALESCE(SUM("best_scores"."best_score"), 0) as sum
		FROM
			"user"."user" uu
			LEFT JOIN
				"school"."class_student" scs ON "uu".id = "scs"."student_id"
			LEFT JOIN
			    "class"."study_group" sg ON "scs"."class_id" = "sg"."class_id"
			LEFT JOIN
			    "class"."study_group_student" sgs ON "sg"."id" = "sgs"."study_group_id"
			LEFT JOIN (
				%s
			) best_scores ON "uu"."id" = "best_scores"."student_id"
		WHERE
			"scs"."class_id" = ANY($%d)
	`, subQuery, argsIndex)
	args = append(args, classIds)
	argsIndex++

	if len(studyGroupIds) != 0 {
		mainQuery += fmt.Sprintf(` AND "sg"."id" = ANY($%d)`, argsIndex)
		argsIndex++
		args = append(args, studyGroupIds)
	}

	mainQuery += ` GROUP BY "uu"."id" `

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, mainQuery)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		mainQuery += fmt.Sprintf(` ORDER BY sum %s OFFSET $%d LIMIT $%d`, sortDirection, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	rows, err := postgresRepository.Database.Queryx(mainQuery, args...)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		item := constant.StudentScoreEntity{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)
	}
	return
}
