package postgres

func (postgresRespository *postgresRepository) GetModelByInventoryId(inventoryId int) (string, error) {
	query := `
	SELECT
	"a"."model_id"
	FROM "inventory"."inventory_avatar" ia
	LEFT JOIN "game"."avatar" a
	ON "ia"."avatar_id" = "a"."id"
	WHERE "ia"."inventory_id" = $1 AND "ia"."is_equipped" = true


 `
	var ModelId string
	err := postgresRespository.Database.QueryRow(query, inventoryId).Scan(&ModelId)
	if err != nil {
		return "", err
	}
	return ModelId, nil

}
