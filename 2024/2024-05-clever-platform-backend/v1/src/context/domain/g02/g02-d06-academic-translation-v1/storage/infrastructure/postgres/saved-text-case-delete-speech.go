package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SavedTextCaseDeleteSpeech(tx *sqlx.Tx, savedTextId int) error {
	query := `
		UPDATE
			"curriculum_group"."saved_text"
		SET
			"speech_url" = NULL
		WHERE
			"id" = $1
	`
	_, err := tx.Exec(query, savedTextId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
