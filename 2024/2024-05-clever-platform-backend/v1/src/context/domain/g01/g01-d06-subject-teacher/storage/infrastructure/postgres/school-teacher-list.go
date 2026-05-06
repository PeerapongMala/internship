package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d06-subject-teacher/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SchoolTeacherList(schoolId int, filter *constant.SchoolTeacherFilter, pagination *helper.Pagination) ([]constant.TeacherEntity, error) {
	query := `
		SELECT
		    "u"."id",
		    "u"."email",
		    "u"."last_login",
		    "u"."title",
		    "u"."first_name",
			"u"."last_name"
		FROM
			"school"."school_teacher" st
		LEFT JOIN
			"user"."user" u
		    ON "st"."user_id" = "u"."id"
		WHERE
		    "st"."school_id" = $1
	`
	args := []interface{}{schoolId}
	argsIndex := 2

	if filter.Id != "" {
		query += fmt.Sprintf(` AND "u"."id" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Id+"%")
		argsIndex++
	}
	if filter.Title != "" {
		query += fmt.Sprintf(` AND "u"."title" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Title+"%")
		argsIndex++
	}
	if filter.FirstName != "" {
		query += fmt.Sprintf(` AND "u"."first_name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.FirstName+"%")
		argsIndex++
	}
	if filter.LastName != "" {
		query += fmt.Sprintf(` AND "u"."last_name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.LastName+"%")
		argsIndex++
	}

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

	teacherEntities := []constant.TeacherEntity{}
	err := postgresRepository.Database.Select(&teacherEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return teacherEntities, nil
}
