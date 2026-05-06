package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d08-teacher-item-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) ItemUpdate(tx *sqlx.Tx, item *constant.ItemEntity) error {
	baseQuery := `
		UPDATE "item"."item" SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := len(args) + 1

	if item.TemplateItemId != nil {
		query = append(query, fmt.Sprintf(` "template_item_id" = $%d`, argsIndex))
		args = append(args, item.TemplateItemId)
		argsIndex++
	}
	if item.ImageUrl != nil {
		query = append(query, fmt.Sprintf(` "image_url" = $%d`, argsIndex))
		args = append(args, item.ImageUrl)
		argsIndex++
	}
	if item.Name != nil {
		query = append(query, fmt.Sprintf(` "name" = $%d`, argsIndex))
		args = append(args, item.Name)
		argsIndex++
	}
	if item.Description != nil {
		query = append(query, fmt.Sprintf(` "description" = $%d`, argsIndex))
		args = append(args, item.Description)
		argsIndex++
	}
	if item.UpdatedAt != nil {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		args = append(args, item.UpdatedAt)
		argsIndex++
	}
	if item.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		args = append(args, item.UpdatedBy)
		argsIndex++
	}
	if item.Status != nil {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		args = append(args, item.Status)
		argsIndex++
	}
	if item.AdminLoginAs != nil {
		query = append(query, fmt.Sprintf(` "admin_login_as" = $%d`, argsIndex))
		args = append(args, item.AdminLoginAs)
		argsIndex++
	}

	if len(query) > 0 {
		baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d`, strings.Join(query, ","), argsIndex)
		args = append(args, item.Id)
		_, err := tx.Exec(baseQuery, args...)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	return nil
}
