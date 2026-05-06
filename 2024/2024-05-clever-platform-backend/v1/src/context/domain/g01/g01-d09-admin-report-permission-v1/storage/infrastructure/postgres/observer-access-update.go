package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d09-admin-report-permission-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ObserverAccessUpdate(tx *sqlx.Tx, observerAccess *constant.ObserverAccessEntity) (*constant.ObserverAccessEntity, error) {
	var queryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx == nil {
		queryMethod = postgresRepository.Database.QueryRowx
	} else {
		queryMethod = tx.QueryRowx
	}
	query := `
		UPDATE "auth"."observer_access"
		SET 
		    "name" = $1,
		    "access_name" = $2,
		    "district_zone" = $3, 
			"area_office" = $4,
			"district_group" = $5, 
			"district" = $6,
			"school_affiliation_id" = $7,
			"status" = $8,
			"updated_at" = $9,
			"updated_by" = $10
		WHERE
			"id" = $11
		RETURNING *
	`
	observerAccessEntity := constant.ObserverAccessEntity{}
	err := queryMethod(
		query,
		observerAccess.Name,
		observerAccess.AccessName,
		observerAccess.DistrictZone,
		observerAccess.AreaOffice,
		observerAccess.DistrictGroup,
		observerAccess.District,
		observerAccess.SchoolAffiliationId,
		observerAccess.Status,
		observerAccess.UpdatedAt,
		observerAccess.UpdatedBy,
		observerAccess.Id,
	).StructScan(&observerAccessEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &observerAccessEntity, nil
}
