package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionCaseGetSubjectLanguage(questionId int) (*string, error) {
	query := `
	SELECT
		"s"."subject_language"
	FROM
		"question"."question" q
	LEFT JOIN	"level"."level" l
		ON "q"."level_id" = "l"."id"
	LEFT JOIN "subject"."sub_lesson" sl
		ON "l"."sub_lesson_id" = "sl"."id"
	LEFT JOIN "subject"."lesson" ls
		ON "sl"."lesson_id" = "ls"."id"
	LEFT JOIN "subject"."subject" s
		ON "ls"."subject_id" = "s"."id"
	WHERE
		"q"."id" = $1
`
	var subjectLanguage *string
	err := postgresRepository.Database.QueryRowx(query, questionId).Scan(&subjectLanguage)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subjectLanguage, nil
}
