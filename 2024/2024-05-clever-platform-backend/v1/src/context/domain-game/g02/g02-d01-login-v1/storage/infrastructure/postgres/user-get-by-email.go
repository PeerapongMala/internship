package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) UserGetByEmail(email string) (*string, error) {
	query := `
		SELECT
			"u"."id"
		FROM
			"auth"."auth_email_password" aep
		LEFT JOIN
			"user"."user" u
			ON "aep"."user_id" = "u"."id"
		WHERE
			"u"."email" = $1
	`
	var userId string
	err := postgresRepository.Database.QueryRowx(query, email).Scan(&userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &userId, nil
}
