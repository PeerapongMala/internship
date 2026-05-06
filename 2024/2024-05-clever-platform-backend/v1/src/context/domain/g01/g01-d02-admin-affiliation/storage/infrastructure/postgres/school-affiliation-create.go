package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"

	"github.com/jmoiron/sqlx"
)

func (postgresRepository *postgresRepository) SchoolAffiliationCreate(tx *sqlx.Tx, schoolAffiliation *constant.SchoolAffiliationEntity) (*constant.SchoolAffiliationEntity, error) {
	type QueryMethod func(query string, args ...interface{}) *sqlx.Row
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.QueryRowx
		}
		return postgresRepository.Database.QueryRowx
	}()
	insertSchoolAffiliationQuery := `
		INSERT INTO "school_affiliation"."school_affiliation" (
			"school_affiliation_group",
			"type",
			"name",
			"short_name",
			"status",
			"created_at",
			"created_by",
			"updated_at",
			"updated_by"
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING *;
	`
	schoolAffiliationEntity := constant.SchoolAffiliationEntity{}
	err := queryMethod(
		insertSchoolAffiliationQuery,
		schoolAffiliation.SchoolAffiliationGroup,
		schoolAffiliation.Type,
		schoolAffiliation.Name,
		schoolAffiliation.ShortName,
		schoolAffiliation.Status,
		schoolAffiliation.CreatedAt,
		schoolAffiliation.CreatedBy,
		schoolAffiliation.UpdatedAt,
		schoolAffiliation.UpdatedBy,
	).StructScan(&schoolAffiliationEntity)
	if err != nil {
		log.Printf("%+v", err)
		return nil, err
	}

	return &schoolAffiliationEntity, nil
}
