package postgres

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) SchoolSubjectCreate(tx *sqlx.Tx, contractId int, schoolIds, subjectIds []int) error {
	if len(schoolIds) == 0 || len(subjectIds) == 0 {
		return nil
	}
	args := []interface{}{}
	placeholders := []string{}

	argsIndex := 1
	for _, schoolId := range schoolIds {
		for _, subjectId := range subjectIds {
			placeholders = append(placeholders, fmt.Sprintf(`($%d, $%d, $%d, $%d)`, argsIndex, argsIndex+1, argsIndex+2, argsIndex+3))
			args = append(args, contractId, schoolId, subjectId, true)
			argsIndex += 4
		}
	}

	query := fmt.Sprintf(`
		INSERT INTO	
			"school"."school_subject" (
			    "contract_id",
				"school_id",
				"subject_id",
				"is_enabled"
			)
		VALUES %s
		ON CONFLICT ("contract_id", "school_id", "subject_id") DO NOTHING
	`, strings.Join(placeholders, ", "))

	_, err := tx.Exec(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
