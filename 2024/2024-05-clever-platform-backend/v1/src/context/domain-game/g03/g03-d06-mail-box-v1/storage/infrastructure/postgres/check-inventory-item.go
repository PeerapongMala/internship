package postgres

func (postgresRepository *postgresRepository) CheckItemInventoryExist(inventoryId int, itemId int) (bool, error) {
	query := `
	SELECT EXISTS (
    SELECT 1
    FROM "inventory"."inventory_item"
    WHERE inventory_id = $1 AND item_id = $2
);
	`
	var exist bool
	err := postgresRepository.Database.QueryRow(query, inventoryId, itemId).Scan(&exist)
	if err != nil {
		return exist, err
	}
	return exist, nil
}
