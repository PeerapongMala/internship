package postgres

import (
	"fmt"
	"log"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolAffiliationCaseListByDate(startDate, endDate *time.Time) ([]constant.SchoolAffiliationEntity, error) {
	query := `
		SELECT
			*
		FROM 
			"school_affiliation"."school_affiliation"	
		WHERE
			TRUE
	`
	args := []interface{}{}
	argsIndex := 1

	if startDate != nil {
		query += fmt.Sprintf(` AND "created_at" >= $%d`, argsIndex)
		args = append(args, startDate)
		argsIndex++
	}
	if endDate != nil {
		query += fmt.Sprintf(` AND "created_at" <= $%d`, argsIndex)
		args = append(args, endDate)
		argsIndex++
	}

	schoolAffiliationEntities := []constant.SchoolAffiliationEntity{}
	err := postgresRepository.Database.Select(&schoolAffiliationEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return schoolAffiliationEntities, nil
}
