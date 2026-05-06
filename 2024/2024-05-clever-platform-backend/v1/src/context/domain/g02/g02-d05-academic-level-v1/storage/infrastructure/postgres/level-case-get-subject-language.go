package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LevelCaseGetSubjectLanguage(levelId int) (*string, error) {
	query := `
		SELECT
			"s"."subject_language"
		FROM
			"level"."level" l
		LEFT JOIN "subject"."sub_lesson" sl
			ON "l"."sub_lesson_id" = "sl"."id"
		LEFT JOIN "subject"."lesson" ls
			ON "sl"."lesson_id" = "ls"."id"
		LEFT JOIN "subject"."subject" s
			ON "ls"."subject_id" = "s"."id"
		WHERE
			"l"."id" = $1
	`
	var subjectLanguage *string
	err := postgresRepository.Database.QueryRowx(query, levelId).Scan(&subjectLanguage)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subjectLanguage, nil
}
