package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"

func (postgresRepository *postgresRepository) ItemReceived(req constant.ItemReceivedRequest) error {
	query := ` INSERT INTO "inventory"."inventory_item"(
inventory_id,
item_id,
amount,
is_equipped
) VALUES($1,$2,$3,$4)
`

	_, err := postgresRepository.Database.Exec(query, req.InventoryId, req.ItemId, req.Amount, false)
	if err != nil {
		return err
	}
	return nil
}
