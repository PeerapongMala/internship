package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthOAuthCaseGetLineByUserId(userId string) (*constant.AuthOAuthEntity, error) {
	query := `
		SELECT
			*
		FROM
			"auth"."auth_oauth"
		WHERE
			"user_id" = $1	
			AND
			"provider" = $2
	`
	authOAuthEntity := constant.AuthOAuthEntity{}
	err := postgresRepository.Database.QueryRowx(query, userId, constant.Line).StructScan(&authOAuthEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &authOAuthEntity, nil
}
