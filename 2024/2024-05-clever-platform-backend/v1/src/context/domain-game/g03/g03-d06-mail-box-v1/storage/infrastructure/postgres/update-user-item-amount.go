package postgres

func (postgresRepository *postgresRepository) UpdateUserItemAmount(inventoryId int, amount int, itemId int) error {
	query := `
UPDATE "inventory"."inventory_item"
SET amount = $1
WHERE inventory_id = $2 AND item_id = $3
`
	_, err := postgresRepository.Database.Exec(query, amount, inventoryId, itemId)
	if err != nil {
		return err
	}
	return nil
}
