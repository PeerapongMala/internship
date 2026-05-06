package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d09-admin-report-permission-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ObserverAccessCreate(observerAccess *constant.ObserverAccessEntity) (*constant.ObserverAccessEntity, error) {
	query := `
		INSERT INTO "auth"."observer_access" (
			"name",
			"access_name",
		    "district_zone",
		    "area_office",
			"district_group",
			"district",
			"school_affiliation_id",
			"status",
			"created_at",
			"created_by"
		)	
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING *
	`
	observerAccessEntity := constant.ObserverAccessEntity{}
	err := postgresRepository.Database.QueryRowx(
		query,
		observerAccess.Name,
		observerAccess.AccessName,
		observerAccess.DistrictZone,
		observerAccess.AreaOffice,
		observerAccess.DistrictGroup,
		observerAccess.District,
		observerAccess.SchoolAffiliationId,
		observerAccess.Status,
		observerAccess.CreatedAt,
		observerAccess.CreatedBy,
	).StructScan(&observerAccessEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &observerAccessEntity, nil
}
