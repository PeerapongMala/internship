package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) InventoryPetUpdate(tx *sqlx.Tx, inventoryId int, petId int) error {
	log.Println(petId)
	query := `
		INSERT INTO "inventory"."inventory_pet" (
			"inventory_id",
			"pet_id",
			"is_equipped"
		)
		VALUES ($1, $2, FALSE)	
		ON CONFLICT ("inventory_id", "pet_id") DO NOTHING 
	`
	_, err := tx.Exec(query, inventoryId, petId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
