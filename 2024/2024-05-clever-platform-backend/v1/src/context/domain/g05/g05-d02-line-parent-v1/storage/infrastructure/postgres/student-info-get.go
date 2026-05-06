package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetStudentInfo(userID string) (*constant.Student, error) {
	query := `
		SELECT
			DISTINCT ON (u.id)
			us.student_id AS student_id,
			u.title,
			u.first_name,
			u.last_name,
			cc.id AS class_id,
			s.id AS school_id,
			s.code AS school_code
		FROM "user".student us
		INNER JOIN class.class cc
			ON us.school_id = cc.school_id
		INNER JOIN school.class_student cs
			ON cs.class_id = cc.id
			AND cs.student_id = us.user_id
		INNER JOIN "user"."user" u
			ON u.id = us.user_id
		INNER JOIN school.school s
			ON s.id = cc.school_id
		WHERE us.user_id = $1 AND cc.status = 'enabled'
		ORDER BY u.id, cc.academic_year DESC
	`

	args := []interface{}{userID}
	student := constant.Student{}
	err := postgresRepository.Database.QueryRowx(query, args...).StructScan(&student)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &student, nil
}
