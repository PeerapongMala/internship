package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) UserCaseDeleteOauth(userId string, provider string) error {
	query := `
		DELETE FROM "auth"."auth_oauth"
		WHERE
			"user_id" = $1
			AND
			"provider" = $2
	`
	_, err := postgresRepository.Database.Exec(query, userId, provider)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
