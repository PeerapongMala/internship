package postgres

import (
	"database/sql"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) UserCaseAddUserRole(tx *sqlx.Tx, userId string, roles []int) ([]int, error) {
	var QueryMethod func(query string, args ...interface{}) (sql.Result, error)
	if tx != nil {
		QueryMethod = tx.Exec
	} else {
		QueryMethod = postgresRepository.Database.Exec
	}

	query := `
		INSERT INTO "user"."user_role" (
			"user_id",
			"role_id"	
		)	
		VALUES ($1, $2);
	`
	for _, role := range roles {
		_, err := QueryMethod(
			query,
			userId,
			role,
		)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	return roles, nil
}
