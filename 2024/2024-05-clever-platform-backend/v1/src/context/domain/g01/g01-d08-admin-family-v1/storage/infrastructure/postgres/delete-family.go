package postgres

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) FamilyDelete(tx *sqlx.Tx, family_id int) error {
	type QueryMethod func(query string, args ...interface{}) (sql.Result, error)
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.Exec
		}
		return postgresRepository.Database.Exec
	}()

	query := `
		WITH deleted_members AS (
			DELETE 
			FROM family.family_member 
			WHERE family_id = $1
		)
		DELETE 
		FROM family.family 
		WHERE id = $1;
	`

	agrs := []interface{}{family_id}
	Affect, err := queryMethod(query, agrs...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	rowsAffected, _ := Affect.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("No family with ID %d found.", family_id)
	}

	return nil
}
