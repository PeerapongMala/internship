package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) TeacherAccessRoleGetByUserID(userId string) ([]int, error) {
	query := `
		SELECT teacher_access_id
		FROM "user".user_teacher_access
		WHERE
			"user_id" = $1	
	`
	roles := []int{}
	err := postgresRepository.Database.Select(&roles, query, userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return roles, nil
}
