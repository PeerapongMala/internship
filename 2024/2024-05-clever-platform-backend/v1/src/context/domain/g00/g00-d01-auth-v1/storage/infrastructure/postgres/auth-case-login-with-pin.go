package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthCaseLoginWithPin(userId string) (*string, error) {
	query := `
		SELECT
			"pin"
		FROM "auth"."auth_pin"
		WHERE
			"user_id" = $1	
	`
	var pin string
	err := postgresRepository.Database.QueryRowx(
		query,
		userId,
	).Scan(&pin)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &pin, nil
}
