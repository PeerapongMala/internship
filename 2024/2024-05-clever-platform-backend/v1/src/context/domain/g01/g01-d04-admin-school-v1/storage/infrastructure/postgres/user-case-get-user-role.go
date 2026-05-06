package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) UserCaseGetUserRole(userId string) ([]int, error) {
	query := `
		SELECT
			"user"."role"."id"
		FROM "user"."role"
		LEFT JOIN "user"."user_role"
			ON "user"."role"."id" = "user"."user_role"."role_id"
		LEFT JOIN "user"."user"
			ON "user"."user_role"."user_id" = "user"."user"."id"
		WHERE "user"."user"."id" = $1;	
	`
	rows, err := postgresRepository.Database.Queryx(
		query,
		userId,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	roles := []int{}
	for rows.Next() {
		var role int
		err := rows.Scan(&role)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		roles = append(roles, role)
	}

	return roles, err
}
