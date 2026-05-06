package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) SeedYearUpdate(tx *sqlx.Tx, seedYear *constant.SeedYearEntity) (*constant.SeedYearEntity, error) {
	var QueryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx != nil {
		QueryMethod = tx.QueryRowx
	} else {
		QueryMethod = postgresRepository.Database.QueryRowx
	}

	baseQuery := `
		UPDATE "curriculum_group"."seed_year" SET
`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if seedYear.Name != "" {
		query = append(query, fmt.Sprintf(` "name" = $%d`, argsIndex))
		args = append(args, seedYear.Name)
		argsIndex++
	}
	if seedYear.ShortName != "" {
		query = append(query, fmt.Sprintf(` "short_name" = $%d`, argsIndex))
		args = append(args, seedYear.ShortName)
		argsIndex++
	}
	if seedYear.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		args = append(args, seedYear.Status)
		argsIndex++
	}
	if !seedYear.UpdatedAt.IsZero() {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		args = append(args, seedYear.UpdatedAt)
		argsIndex++
	}
	if seedYear.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		args = append(args, seedYear.UpdatedBy)
		argsIndex++
	}

	seedYearEntity := constant.SeedYearEntity{}
	baseQuery += fmt.Sprintf(` %s WHERE "id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
	args = append(args, seedYear.Id)
	err := QueryMethod(
		baseQuery,
		args...,
	).StructScan(&seedYearEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &seedYearEntity, nil
}
