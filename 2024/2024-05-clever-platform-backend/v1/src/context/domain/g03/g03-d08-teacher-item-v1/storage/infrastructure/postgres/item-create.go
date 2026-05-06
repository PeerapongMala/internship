package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d08-teacher-item-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ItemCreate(tx *sqlx.Tx, item *constant.ItemEntity, subjectId int, userId string) (*int, error) {
	query := `
		INSERT INTO "item"."item" (
			"teacher_item_group_id",
			"template_item_id",
			"type",
			"name",
			"description",
			"image_url",
			"status",
			"created_at",
			"created_by",
			"admin_login_as"
		)	
		VALUES (
		    (
				SELECT
					"id"	
		    	FROM	
		    	    "teacher_item"."teacher_item_group"
		    	WHERE
		    	    "teacher_id" = $1
		    		AND "subject_id" = $2
			)
			, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING "id"
	`
	var itemId int
	err := tx.QueryRowx(query,
		userId,
		subjectId,
		item.TemplateItemId,
		item.Type,
		item.Name,
		item.Description,
		item.ImageUrl,
		item.Status,
		item.CreatedAt,
		item.CreatedBy,
		item.AdminLoginAs,
	).Scan(&itemId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &itemId, nil
}
