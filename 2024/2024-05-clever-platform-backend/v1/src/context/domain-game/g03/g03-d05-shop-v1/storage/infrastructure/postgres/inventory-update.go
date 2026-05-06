package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) InventoryUpdate(inventoryId int, itemId int) error {
	query := `
		INSERT INTO "inventory"."inventory_item" (
			"inventory_id",
			"item_id",
			"amount",
			"is_equipped"
		)
		VALUES ($1, $2, 1, FALSE)
		ON CONFLICT ("inventory_id", "item_id")
		DO UPDATE SET "amount" = "inventory_item"."amount" + 1
	`
	_, err := postgresRepository.Database.Exec(query, inventoryId, itemId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
