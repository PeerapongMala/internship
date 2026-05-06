package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ShopItemGetPrice(tx *sqlx.Tx, shopItemId int) (*int, error) {
	query := `
		SELECT
			"price"
		FROM
		    "teacher_store"."teacher_store_item"
		WHERE
		    "id" = $1
	`
	var price int
	err := tx.QueryRowx(query, shopItemId).Scan(&price)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &price, nil
}
