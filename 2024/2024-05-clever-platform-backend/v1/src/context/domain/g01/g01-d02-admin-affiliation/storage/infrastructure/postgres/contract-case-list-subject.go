package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ContractCaseListSubject(contractId int) ([]int, error) {
	query := `
		SELECT DISTINCT ON ("s"."id")
			"s"."id" 
		FROM	
			"school_affiliation"."contract_subject_group" csg
		LEFT JOIN
			"subject"."subject" s
			ON "csg"."subject_group_id" = "s"."subject_group_id"
		WHERE
			"csg"."contract_id" = $1
			AND
			"s"."id" IS NOT NULL
	`
	subjectIds := []int{}
	err := postgresRepository.Database.Select(&subjectIds, query, contractId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subjectIds, nil
}
