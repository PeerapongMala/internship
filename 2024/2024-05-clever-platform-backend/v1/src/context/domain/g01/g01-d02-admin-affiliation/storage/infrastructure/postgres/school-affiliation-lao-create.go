package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolAffiliationLaoCreate(tx *sqlx.Tx, schoolAffiliationLao *constant.SchoolAffiliationLaoEntity) (*constant.SchoolAffiliationLaoEntity, error) {
	type QueryMethod func(query string, args ...interface{}) *sqlx.Row
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.QueryRowx
		}
		return postgresRepository.Database.QueryRowx
	}()

	query := `
		INSERT INTO "school_affiliation"."school_affiliation_lao" (
			"school_affiliation_id",
			"type",
			"district",
			"sub_district",
			"province"
		)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING
			"school_affiliation_id", 
    	"type" AS "lao_type", 
    	"district", 
   		"sub_district", 
    	"province";
	`
	schoolAffiliationLaoEntity := constant.SchoolAffiliationLaoEntity{}
	err := queryMethod(
		query,
		schoolAffiliationLao.SchoolAffiliationId,
		schoolAffiliationLao.LaoType,
		schoolAffiliationLao.District,
		schoolAffiliationLao.SubDistrict,
		schoolAffiliationLao.Province,
	).StructScan(&schoolAffiliationLaoEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &schoolAffiliationLaoEntity, err
}
