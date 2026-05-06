package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolAffiliationDoeCreate(tx *sqlx.Tx, schoolAffiliationDoe *constant.SchoolAffiliationDoeEntity) (*constant.SchoolAffiliationDoeEntity, error) {
	type QueryMethod func(query string, args ...interface{}) *sqlx.Row
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.QueryRowx
		}
		return postgresRepository.Database.QueryRowx
	}()
	query := `
		INSERT INTO "school_affiliation"."school_affiliation_doe" (
			"school_affiliation_id",
			"district_zone",
			"district"
		)
		VALUES ($1, $2, $3)
		RETURNING *;
	`
	schoolAffiliationDoeEntity := constant.SchoolAffiliationDoeEntity{}
	err := queryMethod(
		query,
		schoolAffiliationDoe.SchoolAffiliationId,
		schoolAffiliationDoe.DistrictZone,
		schoolAffiliationDoe.District,
	).StructScan(&schoolAffiliationDoeEntity)

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &schoolAffiliationDoeEntity, nil
}
