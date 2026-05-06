package postgres

import (
	"database/sql"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AddMember(tx *sqlx.Tx, familyID int, usersID string, owner bool) error {
	type QueryMethod func(query string, args ...interface{}) (sql.Result, error)
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.Exec
		}
		return postgresRepository.Database.Exec
	}()

	query := `
		INSERT INTO "family"."family_member" (
			"family_id",
			"user_id",
			"is_owner"
		)
		VALUES ($1, $2, $3)
	`

	agrs := []interface{}{familyID, usersID, owner}
	_, err := queryMethod(query, agrs...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
