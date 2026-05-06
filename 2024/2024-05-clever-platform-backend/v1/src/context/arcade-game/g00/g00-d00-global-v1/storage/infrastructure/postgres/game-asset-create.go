package postgres

func (postgresRepository *postgresRepository) CreateModelAsset(modelId string, asset *string) error {
	query := `
	INSERT INTO "game"."game_asset"
	(
	model_id,
	url
	)VALUES($1, $2)
	
	`
	_, err := postgresRepository.Database.Exec(query, modelId, asset)
	if err != nil {
		return err
	}
	return nil
}
