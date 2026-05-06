package postgres

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) DeleteMember(tx *sqlx.Tx, family_id int, userID string) error {
	type QueryMethod func(query string, args ...interface{}) (sql.Result, error)
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.Exec
		}
		return postgresRepository.Database.Exec
	}()

	query := `
		DELETE 
		FROM family.family_member 
		WHERE 
			family_id = $1
			AND user_id = $2
			AND is_owner = false
	`

	agrs := []interface{}{family_id, userID}
	Affect, err := queryMethod(query, agrs...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	rowsAffected, _ := Affect.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("no user found with family_id = %d or this user is owner", family_id)
	}

	return nil
}
