package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) UserGet(email string) (*constant.User, error) {
	query := `
		SELECT
			COALESCE(u.title, '') AS title,
			COALESCE(u.first_name, '') AS first_name,
			COALESCE(u.last_name, '') AS last_name
		FROM "user"."user" u
		WHERE u.email = $1
	`
	var user constant.User
	err := postgresRepository.Database.QueryRowx(query, email).StructScan(&user)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &user, nil
}
