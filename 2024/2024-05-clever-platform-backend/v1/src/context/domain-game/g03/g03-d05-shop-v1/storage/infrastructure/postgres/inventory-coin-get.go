package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) InventoryCoinGet(tx *sqlx.Tx, studentId string) (*int, error) {
	query := `
		SELECT
			"gold_coin"
		FROM
		    "inventory"."inventory"
		WHERE
		    "student_id" = $1
	`
	var amount int
	err := tx.QueryRowx(query, studentId).Scan(&amount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &amount, nil
}
