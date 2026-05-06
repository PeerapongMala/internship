package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SeedPlatformList() ([]constant.SeedPlatformEntity, error) {
	query := `
		SELECT
		    "id",
			"name"
		FROM 
		    "platform"."seed_platform" 
		ORDER BY "id" 
	`
	seedPlatformEntities := []constant.SeedPlatformEntity{}
	err := postgresRepository.Database.Select(&seedPlatformEntities, query)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return seedPlatformEntities, nil
}
