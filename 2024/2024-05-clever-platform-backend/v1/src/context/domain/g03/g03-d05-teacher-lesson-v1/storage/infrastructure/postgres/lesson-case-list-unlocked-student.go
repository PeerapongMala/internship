package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LessonCaseListUnlockedStudent(classId, lessonId int, pagination *helper.Pagination) (students []constant.StudentEntity, err error) {
	query := `
		SELECT
		    "u"."id",
		    "u"."title",
			"u"."first_name",
			"u"."last_name",
			"u"."last_login"
		FROM
			"school"."lesson_unlocked_for_student" lu
		LEFT JOIN
			"user"."student" s
			ON "lu"."user_id" = "s"."user_id"
		LEFT JOIN
			"user"."user" u
			ON "s"."user_id" = "u"."id"
		WHERE
			"lu"."class_id" = $1
			AND
			"lu"."lesson_id" = $2	
	`
	args := []interface{}{classId, lessonId}
	argsIndex := 3

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "u"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	err = postgresRepository.Database.Select(&students, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return students, err
	}

	return students, nil
}
