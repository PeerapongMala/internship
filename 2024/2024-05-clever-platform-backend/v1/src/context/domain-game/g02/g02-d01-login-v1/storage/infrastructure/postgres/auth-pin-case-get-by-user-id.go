package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) AuthPinCaseGetByUserId(userId string) (*constant.AuthPinEntity, error) {
	query := `
		SELECT
			"user_id",
			"pin"
		FROM
		    "auth"."auth_pin"
		WHERE
		    "user_id" = $1
	`
	authPinEntity := constant.AuthPinEntity{}
	err := postgresRepository.Database.QueryRowx(query, userId).StructScan(&authPinEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &authPinEntity, nil
}
