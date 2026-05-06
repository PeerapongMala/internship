package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d08-teacher-item-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) BadgeUpdate(tx *sqlx.Tx, badge *constant.BadgeEntity) error {
	baseQuery := `
		UPDATE "item"."badge" SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := len(args) + 1

	if badge.TemplatePath != nil {
		query = append(query, fmt.Sprintf(` "template_path" = $%d`, argsIndex))
		args = append(args, badge.TemplatePath)
		argsIndex++
	}
	if badge.BadgeDescription != nil {
		query = append(query, fmt.Sprintf(` "badge_description" = $%d`, argsIndex))
		args = append(args, badge.BadgeDescription)
		argsIndex++
	}

	if len(query) > 0 {
		baseQuery += fmt.Sprintf(`%s WHERE "item_id" = $%d`, strings.Join(query, ","), argsIndex)
		args = append(args, badge.ItemId)
		_, err := tx.Exec(baseQuery, args...)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	return nil
}
