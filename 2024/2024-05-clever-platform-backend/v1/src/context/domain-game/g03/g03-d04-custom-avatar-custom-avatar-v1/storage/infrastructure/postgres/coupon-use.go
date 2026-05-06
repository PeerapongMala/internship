package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) CouponUse(tx *sqlx.Tx, itemId int, userId string) (*int64, error) {
	query := `
		UPDATE
			"inventory"."inventory_item"
		SET 
			amount = amount - 1
		WHERE 
			amount > 0
		  	AND item_id = $1
			AND inventory_id = (
				SELECT
					id
				FROM
				    inventory.inventory
				WHERE
				    student_id = $2
			)	
	`
	result, err := tx.Exec(query, itemId, userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &rowsAffected, nil
}
