package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) UserCreate(tx *sqlx.Tx, user constant.User) error {
	query := `
		INSERT INTO "user"."user" (
			"id",
			"email",
			"title",
			"first_name",
			"last_name",
			"id_number",
			"image_url",
			"status",
			"created_at",
			"created_by"
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	`
	_, err := tx.Exec(
		query,
		user.Id,
		user.Email,
		user.Title,
		user.FirstName,
		user.LastName,
		user.IdNumber,
		user.ImageUrl,
		user.Status,
		user.CreatedAt,
		user.CreatedBy,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
