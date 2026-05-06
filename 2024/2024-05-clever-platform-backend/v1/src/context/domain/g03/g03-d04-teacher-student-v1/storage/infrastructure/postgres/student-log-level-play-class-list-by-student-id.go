package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) StudentLogLevelPlayClassListByStudentId(
	studentId string,
	pagination *helper.Pagination,
) ([]constant.ClassEntity, error) {
	query := `
		SELECT
			c.id,
			c.academic_year,
			c.year,
			c.name,
			c.updated_at,
			u.first_name AS "updated_by"
		FROM
			"school"."class_student" cs
		INNER JOIN "class"."class" c ON c.id = cs.class_id
		INNER JOIN "user"."student" s ON s.user_id = cs.student_id
		LEFT JOIN "user"."user" u ON u.id = c.updated_by
		WHERE "s"."user_id" = $1
	`
	args := []interface{}{studentId}
	argsIndex := len(args) + 1
	log.Println(argsIndex)

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY c.academic_year, c.year, c.name DESC LIMIT $%d OFFSET $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Limit, pagination.Offset)
	}

	classes := []constant.ClassEntity{}
	err := postgresRepository.Database.Select(&classes, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return classes, nil
}
