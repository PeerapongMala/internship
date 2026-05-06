package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) IndicatorCaseBulkUpdate(tx *sqlx.Tx, indicator *constant.IndicatorEntity) (*constant.IndicatorEntity, error) {
	baseQuery := `
		UPDATE "curriculum_group"."indicator" SET	
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if indicator.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, indicator.Status)
	}
	if !indicator.UpdatedAt.IsZero() {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		argsIndex++
		args = append(args, indicator.UpdatedAt)
	}
	if indicator.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		argsIndex++
		args = append(args, indicator.UpdatedBy)
	}

	query = append(query, fmt.Sprintf(` "admin_login_as" = $%d`, argsIndex))
	argsIndex++
	args = append(args, indicator.AdminLoginAs)

	baseQuery += fmt.Sprintf(` %s WHERE "id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
	args = append(args, indicator.Id)

	indicatorEntity := constant.IndicatorEntity{}
	err := tx.QueryRowx(
		baseQuery,
		args...,
	).StructScan(&indicatorEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &indicatorEntity, nil
}
