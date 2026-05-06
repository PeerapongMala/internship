package postgres

func (postgresRepository *postgresRepository) CheckAvatarExist(inventoryId int) (bool, error) {
	query := `
	 SELECT EXISTS (
    SELECT 1
    FROM "inventory"."inventory_avatar"
    WHERE inventory_id = $1 and is_equipped = true);
	`
	var exist bool
	err := postgresRepository.Database.QueryRow(query, inventoryId).Scan(&exist)
	if err != nil {
		return exist, err
	}
	return exist, nil
}
