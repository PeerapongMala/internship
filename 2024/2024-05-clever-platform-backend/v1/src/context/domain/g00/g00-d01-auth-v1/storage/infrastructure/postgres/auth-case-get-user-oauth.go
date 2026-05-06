package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthCaseGetUserOAuth(userId string) ([]constant.AuthOAuthEntity, error) {
	query := `
		SELECT
			*
		FROM "auth"."auth_oauth"
		WHERE
			"user_id" = $1	
	`
	rows, err := postgresRepository.Database.Queryx(
		query,
		userId,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	authOauthEntities := []constant.AuthOAuthEntity{}
	for rows.Next() {
		authOauthEntity := constant.AuthOAuthEntity{}
		err := rows.StructScan(&authOauthEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		authOauthEntities = append(authOauthEntities, authOauthEntity)
	}

	return authOauthEntities, nil
}
