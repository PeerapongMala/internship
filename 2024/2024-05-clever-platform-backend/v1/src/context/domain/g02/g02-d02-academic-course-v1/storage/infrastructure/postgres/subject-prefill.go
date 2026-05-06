package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubjectPrefill(tx *sqlx.Tx, subjectGroupId, subjectId int) error {
	query := `
		WITH "target_school" AS (
			SELECT
				"cs"."school_id",
				"cs"."contract_id"
			FROM "school_affiliation"."contract_subject_group" csg
			INNER JOIN "school_affiliation"."contract_school" cs ON "csg"."contract_id" = "cs"."contract_id"
			WHERE "csg"."subject_group_id" = $1	
		)
		INSERT INTO "school"."school_subject" (
			"contract_id",
			"school_id",
			"subject_id",
			"is_enabled"
		)	
		SELECT
			"ts"."contract_id",
			"ts"."school_id",
			$2,
			TRUE
		FROM "target_school" ts
		ON CONFLICT DO NOTHING
	`
	_, err := tx.Exec(query, subjectGroupId, subjectId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
