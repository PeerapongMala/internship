package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ContentCaseBulkUpdate(tx *sqlx.Tx, content *constant.ContentEntity) (*constant.ContentEntity, error) {
	baseQuery := `
		UPDATE "curriculum_group"."content" SET	
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if content.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, content.Status)
	}
	if !content.UpdatedAt.IsZero() {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		argsIndex++
		args = append(args, content.UpdatedAt)
	}
	if content.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		argsIndex++
		args = append(args, content.UpdatedBy)
	}

	query = append(query, fmt.Sprintf(` "admin_login_as" = $%d`, argsIndex))
	argsIndex++
	args = append(args, content.AdminLoginAs)

	baseQuery += fmt.Sprintf(` %s WHERE "id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
	args = append(args, content.Id)

	contentEntity := constant.ContentEntity{}
	err := tx.QueryRowx(
		baseQuery,
		args...,
	).StructScan(&contentEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &contentEntity, nil
}
