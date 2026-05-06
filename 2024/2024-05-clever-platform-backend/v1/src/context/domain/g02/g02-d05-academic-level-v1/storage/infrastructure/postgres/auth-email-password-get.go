package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthEmailPasswordGet(userId string) (*constant.AuthEmailPasswordEntity, error) {
	query := `
		SELECT
			*
		FROM "auth"."auth_email_password"
		WHERE
			"user_id" = $1	
	`
	authEmailPasswordEntity := constant.AuthEmailPasswordEntity{}
	err := postgresRepository.Database.QueryRowx(query, userId).StructScan(&authEmailPasswordEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &authEmailPasswordEntity, nil
}
