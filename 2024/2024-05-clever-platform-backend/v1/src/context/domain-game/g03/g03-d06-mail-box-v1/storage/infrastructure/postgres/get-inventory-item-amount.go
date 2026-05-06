package postgres

func (postgresRepository *postgresRepository) GetInventoryItemAmountById(inventoryId int, itemId int) (int, error) {
	query := `
SELECT
amount
FROM "inventory"."inventory_item"
WHERE inventory_id = $1 AND item_id = $2

`
	var Amount int
	err := postgresRepository.Database.QueryRow(query, inventoryId, itemId).Scan(&Amount)
	if err != nil {
		return Amount, err
	}
	return Amount, nil
}
