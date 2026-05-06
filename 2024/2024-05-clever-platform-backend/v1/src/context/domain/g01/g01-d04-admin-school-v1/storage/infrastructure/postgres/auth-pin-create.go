package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthPinCreate(tx *sqlx.Tx, auth *constant.AuthPinEntity) (*constant.AuthPinEntity, error) {
	var QueryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx != nil {
		QueryMethod = tx.QueryRowx
	} else {
		QueryMethod = postgresRepository.Database.QueryRowx
	}
	query := `
		INSERT INTO "auth"."auth_pin" (
			"user_id",
			"pin"
		)	
		VALUES ($1, $2)
		RETURNING *
	`
	authPinEntity := constant.AuthPinEntity{}
	err := QueryMethod(
		query,
		auth.UserId,
		auth.Pin,
	).StructScan(&authPinEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &authPinEntity, nil

}
