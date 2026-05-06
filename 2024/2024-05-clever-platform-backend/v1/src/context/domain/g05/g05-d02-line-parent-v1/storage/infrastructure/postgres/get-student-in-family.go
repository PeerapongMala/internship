package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetStudentInFamily(userID string, pagination *helper.Pagination) ([]*constant.StudentInFamily, error) {
	query := `
		WITH parent_family_id as (
			SELECT fm.family_id
			FROM family.family_member fm
			WHERE fm.user_id = $1
		)
		SELECT 
			us.user_id,
			us.student_id,
			us.school_id as school_id,
            u.title,
			u.first_name,
			u.last_name,
			u.image_url
		FROM family.family_member fm
		INNER JOIN "user".student us
			ON fm.user_id = us.user_id
		INNER JOIN parent_family_id fi
			ON fi.family_id = fm.family_id
		INNER JOIN "user"."user" u
			ON us.user_id = u.id
	`

	args := []interface{}{userID}
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
	query += fmt.Sprintf(` OFFSET $2 LIMIT $3`)

	var students = []*constant.StudentInFamily{}
	err = postgresRepository.Database.Select(&students, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return students, nil
}
