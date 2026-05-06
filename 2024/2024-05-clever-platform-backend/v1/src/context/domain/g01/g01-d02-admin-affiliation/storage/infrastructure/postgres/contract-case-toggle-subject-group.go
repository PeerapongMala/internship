package postgres

import (
	"database/sql"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ContractCaseToggleSubjectGroup(tx *sqlx.Tx, contractId int, subjectGroupId int, isEnabled bool) error {
	var queryMethod func(query string, args ...interface{}) (sql.Result, error)
	if tx != nil {
		queryMethod = tx.Exec
	} else {
		queryMethod = postgresRepository.Database.Exec
	}

	query := `
				UPDATE "school_affiliation"."contract_subject_group"
				SET
					"is_enabled" = $1
				WHERE
					"subject_group_id" = $2
					AND
					"contract_id" = $3
			`
	_, err := queryMethod(query, isEnabled, subjectGroupId, contractId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
