package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ContractCaseListLesson(contractId int) ([]int, error) {
	query := `
		SELECT DISTINCT ON ("ls"."id")
			"ls"."id"
		FROM
			"school_affiliation"."contract_subject_group" csg
		LEFT JOIN
			"subject"."subject" s
			ON "csg"."subject_group_id" = "s"."subject_group_id"
		LEFT JOIN
			"subject"."lesson" ls
			ON "s"."id" = "ls"."subject_id"
		WHERE	
			"csg"."contract_id" = $1
			AND "ls"."id" IS NOT NULL
	`
	lessonIds := []int{}
	err := postgresRepository.Database.Select(&lessonIds, query, contractId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return lessonIds, nil
}
