package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) InventoryCoinUpdate(tx *sqlx.Tx, studentId string, amount int) error {
	query := `
		UPDATE "inventory"."inventory"
		SET "gold_coin" = $1
		WHERE
		    "student_id" = $2
	`
	_, err := tx.Exec(query, amount, studentId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
