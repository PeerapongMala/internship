package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) UserRoleCreate(tx *sqlx.Tx, userId string, roleId int) error {
	query := `
		INSERT INTO "user"."user_role" (
			"user_id",
			"role_id"
		)
		VALUES ($1, $2)
		ON CONFLICT ("user_id", "role_id") DO NOTHING 
	`
	_, err := tx.Exec(query, userId, roleId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
