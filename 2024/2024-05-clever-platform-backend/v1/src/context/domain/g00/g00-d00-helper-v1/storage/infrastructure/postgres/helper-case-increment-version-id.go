package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) HelperCaseIncrementVersionId() error {
	query := `
		UPDATE "game"."game_asset"
		SET version = 
    		split_part(version, '.', 1) || '.' || 
    		split_part(version, '.', 2) || '.' || 
    		(split_part(version, '.', 3)::int + 1)::text
	`
	_, err := postgresRepository.Database.Exec(query)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
