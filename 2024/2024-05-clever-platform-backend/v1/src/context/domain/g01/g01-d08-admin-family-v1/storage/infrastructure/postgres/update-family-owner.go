package postgres

import (
	"database/sql"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) UpdateFamilyOwner(tx *sqlx.Tx, UserID string, FamilyID int) error {
	type QueryMethod func(query string, args ...interface{}) (sql.Result, error)
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.Exec
		}
		return postgresRepository.Database.Exec
	}()

	query := `
		UPDATE family.family_member
		SET is_owner = CASE 
			WHEN user_id = $1 THEN true
			ELSE false
		END
		WHERE family_id = $2;
	`

	agrs := []interface{}{UserID, FamilyID}
	_, err := queryMethod(query, agrs...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
