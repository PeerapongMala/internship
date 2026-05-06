package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"log"
	"strings"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolAffiliationObecUpdate(tx *sqlx.Tx, schoolAffiliationObec *constant.SchoolAffiliationObecEntity) (*constant.SchoolAffiliationObecEntity, error) {
	var queryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx != nil {
		queryMethod = tx.QueryRowx
	} else {
		queryMethod = postgresRepository.Database.QueryRowx
	}

	baseQuery := `
		UPDATE "school_affiliation"."school_affiliation_obec" SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if schoolAffiliationObec.InspectionArea != "" {
		query = append(query, fmt.Sprintf(` "inspection_area" = $%d`, argsIndex))
		args = append(args, schoolAffiliationObec.InspectionArea)
		argsIndex++
	}
	if schoolAffiliationObec.AreaOffice != "" {
		query = append(query, fmt.Sprintf(` "area_office" = $%d`, argsIndex))
		args = append(args, schoolAffiliationObec.AreaOffice)
		argsIndex++
	}

	schoolAffiliationObecEntity := constant.SchoolAffiliationObecEntity{}

	if len(query) > 0 {
		baseQuery += fmt.Sprintf(`%s WHERE "school_affiliation_id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
		args = append(args, schoolAffiliationObec.SchoolAffiliationId)
		err := queryMethod(baseQuery, args...).StructScan(&schoolAffiliationObecEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}
	if len(query) == 0 {
		baseQuery = `
			SELECT
				*
			FROM "school_affiliation"."school_affiliation_obec"	
			WHERE
				"school_affiliation_id" = $1
		`
		err := queryMethod(
			baseQuery,
			schoolAffiliationObec.SchoolAffiliationId,
		).StructScan(&schoolAffiliationObecEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	return &schoolAffiliationObecEntity, nil
}
