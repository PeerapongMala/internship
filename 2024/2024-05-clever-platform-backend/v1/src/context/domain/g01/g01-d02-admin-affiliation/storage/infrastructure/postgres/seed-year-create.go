package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SeedYearCreate(tx *sqlx.Tx, seedYear *constant.SeedYearEntity) (*constant.SeedYearEntity, error) {
	var QueryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx == nil {
		QueryMethod = postgresRepository.Database.QueryRowx
	} else {
		QueryMethod = tx.QueryRowx
	}

	query := `
		INSERT INTO "curriculum_group"."seed_year" (
		    "name",
			"short_name",
			"status",
			"created_at",
			"created_by"
		)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING *
	`
	seedYearEntity := constant.SeedYearEntity{}
	err := QueryMethod(
		query,
		seedYear.Name,
		seedYear.ShortName,
		seedYear.Status,
		seedYear.CreatedAt,
		seedYear.CreatedBy,
	).StructScan(&seedYearEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &seedYearEntity, nil
}
