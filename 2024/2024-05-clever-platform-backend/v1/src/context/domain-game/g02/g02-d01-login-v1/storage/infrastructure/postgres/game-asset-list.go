package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GameAssetList() ([]constant.GameAssetEntity, error) {
	query := `
		SELECT
			"model_id",
			"url",
			"version"
		FROM
		    "game"."game_asset"
	`
	gameAssets := []constant.GameAssetEntity{}
	err := postgresRepository.Database.Select(&gameAssets, query)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return gameAssets, nil
}
