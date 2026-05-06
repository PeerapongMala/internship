package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) InventoryAvatarUpdate(tx *sqlx.Tx, inventoryId int, avatarId int) error {
	query := `
		INSERT INTO "inventory"."inventory_avatar" (
			"inventory_id",
			"avatar_id",
			"is_equipped"
		)
		VALUES ($1, $2, FALSE)	
		ON CONFLICT DO NOTHING 
	`
	_, err := tx.Exec(query, inventoryId, avatarId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
