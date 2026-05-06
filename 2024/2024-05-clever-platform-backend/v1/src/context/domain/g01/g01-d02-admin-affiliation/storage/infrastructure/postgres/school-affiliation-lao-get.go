package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolAffiliationLaoGet(schoolAffiliationId int) (*constant.SchoolAffiliationLaoEntity, error) {
	query := ` 
		SELECT
			"school_affiliation_id",
			"type" AS "lao_type",
			"district",
			"sub_district",
			"province"
		FROM "school_affiliation"."school_affiliation_lao"	
		WHERE
			"school_affiliation_id" = $1
	`
	schoolAffiliationLaoEntity := constant.SchoolAffiliationLaoEntity{}
	err := postgresRepository.Database.QueryRowx(query, schoolAffiliationId).StructScan(&schoolAffiliationLaoEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &schoolAffiliationLaoEntity, nil
}
