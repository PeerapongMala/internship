package postgres

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) StudentByStudentId(studentId string) (constant.StudentEntity, error) {
	sql := `
		SELECT 
			s.user_id,
			s.student_id,
			u.title,
			u.first_name,
			u.last_name,
			u.email,
			u.last_login,
			u.status,
			u.updated_at,
			u.updated_by
		FROM "user".student s
		LEFT JOIN "user"."user" u ON u.id = s.user_id
		WHERE s.user_id = $1
	`

	student := constant.StudentEntity{}
	err := postgresRepository.Database.QueryRowx(sql, studentId).StructScan(&student)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return student, helper.NewHttpError(http.StatusNotFound, nil)
	}

	return student, nil
}
