package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SchoolCaseRemoveContractSubject(tx *sqlx.Tx, contractId, schoolId int) error {
	query := `
		DELETE FROM 
			"school"."school_subject"
		WHERE
			"contract_id" = $1	
			AND
		    "school_id" = $2
	`

	_, err := tx.Exec(query, contractId, schoolId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
