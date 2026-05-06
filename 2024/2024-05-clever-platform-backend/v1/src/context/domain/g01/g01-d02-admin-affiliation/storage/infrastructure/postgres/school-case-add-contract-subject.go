package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SchoolCaseAddContractSubject(tx *sqlx.Tx, contractId int) error {
	query := `
		SELECT
			"sas"."school_id"
		FROM
			"school_affiliation"."contract" c
		LEFT JOIN
			"school_affiliation"."school_affiliation_school" sas
			ON "c"."school_affiliation_id" = "sas"."school_affiliation_id"
		WHERE
			"c"."id" = $1
	`
	schoolIds := []int{}
	err := tx.Select(&schoolIds, query, contractId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	query = `
		INSERT INTO
			"school"."school_subject" (
				"contract_id",
				"school_id",
				"subject_id",
				"is_enabled"
			)
		SELECT
		    $1,
			$2,
			"s"."id" AS "subject_id",
			$3
		FROM
			"school_affiliation"."contract_subject_group" sg
		LEFT JOIN
			"subject"."subject" s
			ON "s"."subject_group_id" = "sg"."subject_group_id"
		WHERE
		    "sg"."contract_id" = $1
	`

	for _, schoolId := range schoolIds {
		_, err = tx.Exec(query, contractId, schoolId, true)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	return nil
}
