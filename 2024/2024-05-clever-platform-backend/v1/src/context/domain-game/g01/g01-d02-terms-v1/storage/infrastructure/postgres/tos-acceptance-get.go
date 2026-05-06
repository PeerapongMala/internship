package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) TosAcceptanceGet(tosId int, userId string) (*bool, error) {
	query := `
		SELECT EXISTS (
			SELECT
				1
			FROM
			    "tos"."tos_acceptance"
			WHERE
			    "user_id" = $1
				AND
			    "tos_id" = $2
		)
	`
	var isExists *bool
	err := postgresRepository.Database.QueryRowx(query, userId, tosId).Scan(&isExists)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return isExists, nil
}
