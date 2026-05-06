package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) UserCreate(tx *sqlx.Tx, user *constant.UserEntity) (*constant.UserEntity, error) {
	type QueryMethod func(query string, args ...interface{}) *sqlx.Row
	queryMethod := func() QueryMethod {
		if tx != nil {
			log.Println(tx)
			return tx.QueryRowx
		}
		return postgresRepository.Database.QueryRowx
	}()
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
		RETURNING *;
	`
	userEntity := constant.UserEntity{}
	err := queryMethod(
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
	).StructScan(&userEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &userEntity, nil
}
