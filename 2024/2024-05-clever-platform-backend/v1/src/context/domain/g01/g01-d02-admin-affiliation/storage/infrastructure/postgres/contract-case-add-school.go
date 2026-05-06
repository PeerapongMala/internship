package postgres

import (
	"database/sql"
	"fmt"
	"log"
	"strings"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ContractCaseAddSchool(tx *sqlx.Tx, contractId int, schoolIds []int) ([]int, error) {
	var queryMethod func(query string, args ...interface{}) (sql.Result, error)
	if tx != nil {
		queryMethod = tx.Exec
	} else {
		queryMethod = postgresRepository.Database.Exec
	}

	if len(schoolIds) > 0 {
		args := []interface{}{}
		query := []string{}
		for i, schoolId := range schoolIds {
			query = append(query, fmt.Sprintf(` ($%d, $%d)`, i*2+1, i*2+2))
			args = append(args, contractId, schoolId)
		}

		insertQuery := fmt.Sprintf(`
			INSERT INTO "school_affiliation"."contract_school" (
			"contract_id",
			"school_id"	
			)
			VALUES %s
			ON CONFLICT ("contract_id", "school_id") DO NOTHING
		`, strings.Join(query, ","))

		_, err := queryMethod(insertQuery, args...)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	return schoolIds, nil
}
