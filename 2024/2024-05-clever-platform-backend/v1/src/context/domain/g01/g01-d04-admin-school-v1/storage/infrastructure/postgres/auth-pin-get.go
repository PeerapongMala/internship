package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthPinGet(userId string) (*constant.AuthPinEntity, error) {
	query := `
		SELECT
			*
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
