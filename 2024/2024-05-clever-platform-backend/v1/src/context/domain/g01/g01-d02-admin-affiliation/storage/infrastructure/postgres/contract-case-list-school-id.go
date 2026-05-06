package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ContractCaseListSchoolId(contractId int) ([]int, error) {
	query := `
		SELECT
			"school_id"
		FROM
			"school_affiliation"."contract_school"
		WHERE
			"contract_id" = $1
	`
	schoolIds := []int{}
	err := postgresRepository.Database.Select(&schoolIds, query, contractId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return schoolIds, nil
}
