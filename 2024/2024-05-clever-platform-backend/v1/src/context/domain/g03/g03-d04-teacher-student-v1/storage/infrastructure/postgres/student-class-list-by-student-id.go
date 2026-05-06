package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) StudentClassListByStudentId(
	studentId string,
	pagination *helper.Pagination,
) ([]constant.ClassEntity, error) {
	baseQuery := `
		SELECT
			c.id,
			c.academic_year,
			c."year",
			c.updated_at,
			c.name,
			u.first_name || ' ' || u.last_name AS updated_by
		FROM school.class_student cs
		LEFT JOIN "class"."class" c ON c.id = cs.class_id
		LEFT JOIN "user".student s ON s.user_id = cs.student_id
		LEFT JOIN "user"."user" u ON u.id = c.updated_by
		WHERE s.student_id = $1
	`

	countQuery := `
		SELECT
			COUNT(*) as total_count
		FROM school.class_student cs
		LEFT JOIN "class"."class" c ON c.id = cs.class_id
		LEFT JOIN "user".student s ON s.user_id = cs.student_id
		WHERE s.student_id = $1
	`
	if pagination != nil {
		err := postgresRepository.Database.QueryRowx(countQuery, studentId).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}
	if pagination != nil && pagination.Limit.Valid {
		baseQuery += fmt.Sprintf(` ORDER BY academic_year DESC LIMIT %d OFFSET %d`, pagination.Limit.Int64, pagination.Offset)
	}

	classes := []constant.ClassEntity{}
	err := postgresRepository.Database.Select(&classes, baseQuery, studentId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return classes, nil
}
