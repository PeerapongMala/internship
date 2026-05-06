package postgres

import (
	"database/sql"
	"fmt"
	"log"
	"strings"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ContractCaseDeleteSubjectGroup(tx *sqlx.Tx, contractId int, subjectGroups []int) ([]int, error) {
	var queryMethod func(query string, args ...interface{}) (sql.Result, error)
	if tx != nil {
		queryMethod = tx.Exec
	} else {
		queryMethod = postgresRepository.Database.Exec
	}

	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	for _, id := range subjectGroups {
		query = append(query, fmt.Sprintf(`$%d`, argsIndex))
		args = append(args, id)
		argsIndex++
	}

	if len(query) > 0 {
		deleteQuery := fmt.Sprintf(`
		DELETE FROM "school_affiliation"."contract_subject_group" 
		WHERE
			"subject_group_id" IN (%s)
			AND
			"contract_id" = $%d
	`, strings.Join(query, ","), argsIndex)
		args = append(args, contractId)
		argsIndex++

		_, err := queryMethod(deleteQuery, args...)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	return subjectGroups, nil
}
