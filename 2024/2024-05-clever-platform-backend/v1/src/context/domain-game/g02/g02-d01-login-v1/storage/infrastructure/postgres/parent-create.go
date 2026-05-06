package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ParentCreate(tx *sqlx.Tx, parent *constant.ParentEntity) error {
	query := `
		INSERT INTO "user"."parent" (
			"user_id",
			"relationship",
			"phone_number",
			"birth_date"
		)
		VALUES ($1, $2, $3, $4)
	`
	_, err := tx.Exec(query, parent.UserId, parent.Relationship, parent.PhoneNumber, parent.BirthDate)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
