package postgres

import (
	"database/sql"
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ContractCaseAddSubjectGroup(tx *sqlx.Tx, contractId int, subjectGroups []constant.ContractSubjectGroupEntity) ([]constant.ContractSubjectGroupEntity, error) {
	var queryMethod func(query string, args ...interface{}) (sql.Result, error)
	if tx != nil {
		queryMethod = tx.Exec
	} else {
		queryMethod = postgresRepository.Database.Exec
	}

	if len(subjectGroups) > 0 {
		args := []interface{}{}
		query := []string{}
		for i, subjectGroup := range subjectGroups {
			query = append(query, fmt.Sprintf(` ($%d, $%d, $%d)`, i*3+1, i*3+2, i*3+3))
			args = append(args, contractId, subjectGroup.SubjectGroupId, true)
		}

		insertQuery := fmt.Sprintf(`
			INSERT INTO "school_affiliation"."contract_subject_group" (
				"contract_id",
				"subject_group_id",
				"is_enabled"
			)	
			VALUES %s
			ON CONFLICT ("contract_id", "subject_group_id") DO NOTHING
		`, strings.Join(query, ","))
		_, err := queryMethod(
			insertQuery,
			args...,
		)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	return subjectGroups, nil
}
