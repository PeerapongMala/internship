package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolAffiliationLaoUpdate(tx *sqlx.Tx, schoolAffiliationLao *constant.SchoolAffiliationLaoEntity) (*constant.SchoolAffiliationLaoEntity, error) {
	var queryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx != nil {
		queryMethod = tx.QueryRowx
	} else {
		queryMethod = postgresRepository.Database.QueryRowx
	}

	baseQuery := `
		UPDATE "school_affiliation"."school_affiliation_lao" SET	
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if schoolAffiliationLao.LaoType != "" {
		query = append(query, fmt.Sprintf(` "type" = $%d`, argsIndex))
		argsIndex++
		args = append(args, schoolAffiliationLao.LaoType)
	}
	if schoolAffiliationLao.Province != "" {
		query = append(query, fmt.Sprintf(` "province" = $%d`, argsIndex))
		argsIndex++
		args = append(args, schoolAffiliationLao.Province)
	}
	if schoolAffiliationLao.District != "" {
		query = append(query, fmt.Sprintf(` "district" = $%d`, argsIndex))
		argsIndex++
		args = append(args, schoolAffiliationLao.District)
	}
	if schoolAffiliationLao.SubDistrict != "" {
		query = append(query, fmt.Sprintf(` "sub_district" = $%d`, argsIndex))
		argsIndex++
		args = append(args, schoolAffiliationLao.SubDistrict)
	}

	schoolAffiliationLaoEntity := constant.SchoolAffiliationLaoEntity{}

	if len(query) > 0 {
		baseQuery += fmt.Sprintf(`%s WHERE "school_affiliation_id" = $%d RETURNING "school_affiliation_id", "type" AS "lao_type", "district", "sub_district", "province";`, strings.Join(query, ","), argsIndex)
		args = append(args, schoolAffiliationLao.SchoolAffiliationId)
		err := queryMethod(
			baseQuery,
			args...,
		).StructScan(&schoolAffiliationLaoEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}
	if len(query) == 0 {
		baseQuery := `
			SELECT
				*
			FROM "school_affiliation"."school_affiliation_lao"
			WHERE
				"school_affiliation_id" = $1
		`
		err := queryMethod(
			baseQuery,
			schoolAffiliationLao.SchoolAffiliationId,
		).StructScan(&schoolAffiliationLaoEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	return &schoolAffiliationLaoEntity, nil
}
