package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d12-teacher-profile-v1/constant"
	"log"

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
