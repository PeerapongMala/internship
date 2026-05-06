package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LessonList(userID string, subjectID int, pagination *helper.Pagination) ([]*constant.Lesson, error) {
	query := `
		SELECT DISTINCT ON ("l"."id")
			l.id as lesson_id,
			l.name as lesson_name
		FROM "user".student us
		INNER JOIN school.school_lesson sl
			ON us.school_id = sl.school_id
		INNER JOIN subject.lesson l
			ON l.id = sl.lesson_id
		WHERE 
			l.subject_id = $1
			AND us.user_id = $2
	`

	args := []interface{}{subjectID, userID}
	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
	err := postgresRepository.Database.QueryRowx(
		countQuery,
		args...,
	).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	args = append(args, pagination.Offset, pagination.Limit)
	query += fmt.Sprintf(` OFFSET $3 LIMIT $4`)

	lessons := []*constant.Lesson{}
	err = postgresRepository.Database.Select(&lessons, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	log.Println("lessons: ", lessons)

	return lessons, nil
}
