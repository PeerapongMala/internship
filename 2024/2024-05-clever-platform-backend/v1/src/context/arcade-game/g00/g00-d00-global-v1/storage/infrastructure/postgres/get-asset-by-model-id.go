package postgres

func (postgresRepository *postgresRepository) GetAssetByModelId(modelId string) (*string, error) {
	query := `
	SELECT
	url
	FROM "game"."game_asset"
	WHERE model_id = $1
	`
	var asset *string
	err := postgresRepository.Database.QueryRow(query, modelId).Scan(&asset)
	if err != nil {
		return nil, err
	}

	return asset, nil
}
