package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"log"
	"strings"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolAffiliationDoeUpdate(tx *sqlx.Tx, schoolAffiliationDoe *constant.SchoolAffiliationDoeEntity) (*constant.SchoolAffiliationDoeEntity, error) {
	var queryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx != nil {
		queryMethod = tx.QueryRowx
	} else {
		queryMethod = postgresRepository.Database.QueryRowx
	}

	baseQuery := `
		UPDATE "school_affiliation"."school_affiliation_doe" SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if schoolAffiliationDoe.DistrictZone != "" {
		query = append(query, fmt.Sprintf(` "district_zone" = $%d`, argsIndex))
		argsIndex++
		args = append(args, schoolAffiliationDoe.DistrictZone)
	}
	if schoolAffiliationDoe.District != "" {
		query = append(query, fmt.Sprintf(` "district" = $%d`, argsIndex))
		argsIndex++
		args = append(args, schoolAffiliationDoe.District)
	}

	schoolAffiliationDoeEntity := constant.SchoolAffiliationDoeEntity{}

	if len(query) > 0 {
		baseQuery += fmt.Sprintf(`%s WHERE "school_affiliation_id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
		args = append(args, schoolAffiliationDoe.SchoolAffiliationId)
		err := queryMethod(
			baseQuery,
			args...,
		).StructScan(&schoolAffiliationDoeEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}
	if len(query) == 0 {
		baseQuery = `
			SELECT
				*
			FROM "school_affiliation"."school_affiliation_doe"
			WHERE
				"school_affiliation_id" = $1
		`
		err := queryMethod(
			baseQuery,
			schoolAffiliationDoe.SchoolAffiliationId,
		).StructScan(&schoolAffiliationDoeEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	return &schoolAffiliationDoeEntity, nil
}
