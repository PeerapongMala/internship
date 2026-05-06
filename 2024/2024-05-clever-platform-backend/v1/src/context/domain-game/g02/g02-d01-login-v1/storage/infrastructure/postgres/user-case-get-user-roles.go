package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) UserCaseGetUserRoles(userId string) ([]int, error) {
	query := `
		SELECT
			"role_id"
		FROM "user"."user_role"
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
