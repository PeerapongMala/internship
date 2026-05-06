package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LevelDelete(tx *sqlx.Tx, levelIds []int) error {
	if len(levelIds) == 0 {
		return nil
	}
	query := `
		DELETE FROM "level"."level"	
		WHERE
			"id" = ANY($1)
	`

	_, err := tx.Exec(query, levelIds)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
