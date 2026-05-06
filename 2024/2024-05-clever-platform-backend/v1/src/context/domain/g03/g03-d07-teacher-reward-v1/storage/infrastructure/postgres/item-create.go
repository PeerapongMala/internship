package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ItemCreate(tx *sqlx.Tx, item constant.ItemEntity) (int, error) {
	query := `
		INSERT INTO "item"."item" ( 
		    "type",
			"name",
			"description",
			"image_url",
			"status",
			"created_at",
			"created_by",
			"admin_login_as"
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING "id"
	`
	var id int
	err := tx.QueryRowx(query, item.Type, item.Name, item.Description, item.ImageUrl, item.Status, item.CreatedAt, item.CreatedBy, item.AdminLoginAs).Scan(&id)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return 0, err
	}

	return id, nil
}
