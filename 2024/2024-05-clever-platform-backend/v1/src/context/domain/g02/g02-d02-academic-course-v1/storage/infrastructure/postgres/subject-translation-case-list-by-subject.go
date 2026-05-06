package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubjectTranslationCaseListBySubject(subjectId int) ([]string, error) {
	query := `
		SELECT
			"language"
		FROM "subject"."subject_translation"
		WHERE
			"subject_id" = $1	
	`
	languages := []string{}
	err := postgresRepository.Database.Select(&languages, query, subjectId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return languages, nil
}
