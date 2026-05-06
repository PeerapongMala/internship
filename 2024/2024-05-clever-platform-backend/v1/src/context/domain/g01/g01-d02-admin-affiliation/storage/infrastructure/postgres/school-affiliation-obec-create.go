package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolAffiliationObecCreate(tx *sqlx.Tx, schoolAffiliationObec *constant.SchoolAffiliationObecEntity) (*constant.SchoolAffiliationObecEntity, error) {
	type QueryMethod func(query string, args ...interface{}) *sqlx.Row
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.QueryRowx
		}
		return postgresRepository.Database.QueryRowx
	}()

	query := `
		INSERT INTO "school_affiliation"."school_affiliation_obec" (
			"school_affiliation_id",
			"inspection_area",
			"area_office"
		)
		VALUES ($1, $2, $3)
		RETURNING *;
	`
	schoolAffiliationObecEntity := constant.SchoolAffiliationObecEntity{}
	err := queryMethod(
		query,
		schoolAffiliationObec.SchoolAffiliationId,
		schoolAffiliationObec.InspectionArea,
		schoolAffiliationObec.AreaOffice,
	).StructScan(&schoolAffiliationObecEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &schoolAffiliationObecEntity, err
}
