package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d08-teacher-item-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) BadgeCreate(tx *sqlx.Tx, badge *constant.BadgeEntity) error {
	query := `
		INSERT INTO "item"."badge" (
			"item_id",
			"template_path",
			"badge_description"
		)
		VALUES ($1, $2, $3)
	`
	_, err := tx.Exec(query, badge.ItemId, badge.TemplatePath, badge.BadgeDescription)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
