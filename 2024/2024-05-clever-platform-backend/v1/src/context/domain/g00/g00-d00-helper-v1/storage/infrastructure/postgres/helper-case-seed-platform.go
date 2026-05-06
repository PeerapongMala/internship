package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) HelperCaseSeedPlatform(tx *sqlx.Tx) error {
	query := `
	INSERT INTO "platform"."seed_platform" (
    "id",
    "name",
    "owner",
    "remark"
)
VALUES
    (1, 'Clever Platform', 'Pat', 'Pat''s Clever Platform'),
    (2, 'Sci Lab', 'Pat', 'Pat''s Sci lab');
	`
	_, err := tx.Exec(query)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
