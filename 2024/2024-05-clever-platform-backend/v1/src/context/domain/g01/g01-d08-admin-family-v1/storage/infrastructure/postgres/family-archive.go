package postgres

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) FamilyArchive(tx *sqlx.Tx, family *constant.Family) error {
	type QueryMethod func(query string, args ...interface{}) (sql.Result, error)
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.Exec
		}
		return postgresRepository.Database.Exec
	}()

	query := `
		UPDATE family.family SET
		status = $1,
		updated_by = $2,
		updated_at = $3
		WHERE id = $4
	`

	agrs := []interface{}{family.Status, family.UpdatedBy, family.UpdatedAt, family.FamilyID}
	Affect, err := queryMethod(query, agrs...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	rowsAffected, _ := Affect.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("no record found with family_id = %d", family.FamilyID)
	}

	return nil
}
