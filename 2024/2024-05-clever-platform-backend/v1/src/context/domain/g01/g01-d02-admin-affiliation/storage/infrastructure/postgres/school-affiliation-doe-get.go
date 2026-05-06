package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolAffiliationDoeGet(schoolAffiliationId int) (*constant.SchoolAffiliationDoeEntity, error) {
	query := `
		SELECT
			*
		FROM "school_affiliation"."school_affiliation_doe"	
		WHERE
			"school_affiliation_id" = $1
	`
	schoolAffiliationDoeEntity := constant.SchoolAffiliationDoeEntity{}
	err := postgresRepository.Database.QueryRowx(
		query,
		schoolAffiliationId,
	).StructScan(&schoolAffiliationDoeEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &schoolAffiliationDoeEntity, err
}
