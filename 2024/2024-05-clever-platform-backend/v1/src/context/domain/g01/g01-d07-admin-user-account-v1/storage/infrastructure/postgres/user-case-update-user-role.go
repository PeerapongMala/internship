package postgres

import (
	"database/sql"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) UserCaseUpdateUserRole(tx *sqlx.Tx, userId string, roles []int) error {
	type QueryMethod func(query string, args ...interface{}) (sql.Result, error)
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.Exec
		}
		return postgresRepository.Database.Exec
	}()

	if roles == nil {
		return nil
	}

	query := `
		DELETE FROM "user"."user_role"
		WHERE
			"user_id" = $1
			AND
			"role_id" != 1
	`
	_, err := queryMethod(query, userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	query = `
		INSERT INTO "user"."user_role" (
			"user_id",
			"role_id"	
		)
		VALUES ($1, $2)
		ON CONFLICT ("user_id", "role_id") DO NOTHING;
	`
	for _, role := range roles {
		_, err := queryMethod(query, userId, role)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	return nil
}
