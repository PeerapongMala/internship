package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) HelperCaseSeedRole(tx *sqlx.Tx) error {
	query := `
		INSERT INTO "user"."role" (
			"id",
			"name"
		)
		VALUES
			(1, 'admin'),
			(2, 'content_creator'),
			(3, 'game_master'),
			(4, 'observer'),
			(5, 'announcer'),
			(6, 'teacher'),
			(7, 'student'),
			(8, 'parent');
	`
	_, err := tx.Exec(query)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
