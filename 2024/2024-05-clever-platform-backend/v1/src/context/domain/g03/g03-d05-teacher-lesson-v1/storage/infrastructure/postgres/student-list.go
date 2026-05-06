package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) StudentList(classId int, filter constant.StudentFilter, pagination *helper.Pagination) ([]constant.StudentEntity, error) {
	query := `
		SELECT
			"u"."id",
			"u"."title",
			"u"."first_name",
			"u"."last_name"	
		FROM
			"school"."class_student" cs
		LEFT JOIN
			"user"."student" s
			ON "cs"."student_id" = "s"."user_id"
		LEFT JOIN
			"user"."user" u
			ON "s"."user_id" = "u"."id"
		WHERE
			"cs"."class_id" = $1
	`
	args := []interface{}{classId}
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
		log.Println(countQuery)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "u"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	students := []constant.StudentEntity{}
	err := postgresRepository.Database.Select(&students, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return students, nil
}
