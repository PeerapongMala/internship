package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) CriteriaCaseBulkUpdate(tx *sqlx.Tx, criteria *constant.CriteriaEntity) (*constant.CriteriaEntity, error) {
	baseQuery := `
		UPDATE "curriculum_group"."criteria" SET	
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if criteria.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, criteria.Status)
	}
	if !criteria.UpdatedAt.IsZero() {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		argsIndex++
		args = append(args, criteria.UpdatedAt)
	}
	if criteria.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		argsIndex++
		args = append(args, criteria.UpdatedBy)
	}

	query = append(query, fmt.Sprintf(` "admin_login_as" = $%d`, argsIndex))
	argsIndex++
	args = append(args, criteria.AdminLoginAs)

	baseQuery += fmt.Sprintf(` %s WHERE "id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
	args = append(args, criteria.Id)

	criteriaEntity := constant.CriteriaEntity{}
	err := tx.QueryRowx(
		baseQuery,
		args...,
	).StructScan(&criteriaEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &criteriaEntity, nil
}
