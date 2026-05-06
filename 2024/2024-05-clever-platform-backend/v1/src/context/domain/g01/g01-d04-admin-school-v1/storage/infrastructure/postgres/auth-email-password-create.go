package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthEmailPasswordCreate(tx *sqlx.Tx, auth *constant.AuthEmailPasswordEntity) (*constant.AuthEmailPasswordEntity, error) {
	var QueryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx != nil {
		QueryMethod = tx.QueryRowx
	} else {
		QueryMethod = postgresRepository.Database.QueryRowx
	}
	query := `
		INSERT INTO "auth"."auth_email_password" (
			"user_id",
			"password_hash"	
		)	
		VALUES ($1, $2)
		RETURNING *
	`
	authEmailPasswordEntity := constant.AuthEmailPasswordEntity{}
	err := QueryMethod(
		query,
		auth.UserId,
		auth.PasswordHash,
	).StructScan(&authEmailPasswordEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &authEmailPasswordEntity, nil
}
