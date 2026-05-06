package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/jmoiron/sqlx"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) YearUpdate(tx *sqlx.Tx, year *constant.YearEntity) (*constant.YearEntity, error) {
	var QueryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx != nil {
		QueryMethod = tx.QueryRowx
	} else {
		QueryMethod = postgresRepository.Database.QueryRowx
	}
	baseQuery := `
		UPDATE "curriculum_group"."year" AS y
		SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if year.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, year.Status)
	}
	if year.SeedYearId != 0 {
		query = append(query, fmt.Sprintf(` "seed_year_id" = $%d`, argsIndex))
		argsIndex++
		args = append(args, year.SeedYearId)
	}
	if !year.UpdatedAt.IsZero() {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		argsIndex++
		args = append(args, year.UpdatedAt)
	}
	if year.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		argsIndex++
		args = append(args, year.UpdatedBy)
	}
	query = append(query, fmt.Sprintf(` "admin_login_as" = $%d`, argsIndex))
	argsIndex++
	args = append(args, year.AdminLoginAs)

	baseQuery += fmt.Sprintf(`%s WHERE "y"."id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
	args = append(args, year.Id)

	yearEntity := constant.YearEntity{}
	err := QueryMethod(
		baseQuery,
		args...,
	).StructScan(&yearEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &yearEntity, nil
}
