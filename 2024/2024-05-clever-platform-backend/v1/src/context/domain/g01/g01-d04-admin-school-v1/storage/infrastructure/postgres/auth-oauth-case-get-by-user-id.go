package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthOauthCaseGetByUserId(userId string) ([]constant.AuthOauthEntity, error) {
	query := `
		SELECT
			* 
		FROM 
			"auth"."auth_oauth"
		WHERE
			"user_id" = $1
	`
	authOauthEntities := []constant.AuthOauthEntity{}
	err := postgresRepository.Database.Select(&authOauthEntities, query, userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return authOauthEntities, nil
}
