package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ShopGetItemId(shopItemId int) (*int, error) {
	query := `
		SELECT
			"item_id"
		FROM
			"teacher_store"."teacher_store_item"
		WHERE
		    "id" = $1
	`
	var itemId int
	err := postgresRepository.Database.QueryRowx(query, shopItemId).Scan(&itemId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &itemId, nil
}
