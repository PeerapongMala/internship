package postgres

import (
	"database/sql"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthPinUpdate(tx *sqlx.Tx, auth *constant.AuthPinEntity) error {
	var QueryMethod func(query string, args ...any) (sql.Result, error)
	if tx != nil {
		QueryMethod = tx.Exec
	} else {
		QueryMethod = postgresRepository.Database.Exec
	}
	query := `
		INSERT INTO "auth"."auth_pin" ("user_id", "pin")
		VALUES($2, $1)
		ON CONFLICT ("user_id")
		DO UPDATE SET "pin" = EXCLUDED."pin"
	`
	_, err := QueryMethod(
		query,
		auth.Pin,
		auth.UserId,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
