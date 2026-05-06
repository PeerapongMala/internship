package postgres

func (postgresRepository *postgresRepository) GetInventoryId(UserId string) (int, error) {
	query := `
 	SELECT
 		id
 	FROM "inventory"."inventory"
 	WHERE student_id = $1
 `
	var inventoryId int
	err := postgresRepository.Database.QueryRow(query, UserId).Scan(&inventoryId)
	if err != nil {
		return inventoryId, err
	}
	return inventoryId, nil
}
