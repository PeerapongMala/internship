package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubLessonCaseGetSubjectId(subLessonId int) (*int, error) {
	query := `
		SELECT
			"s"."id"
		FROM
		    "subject"."sub_lesson" sl
		LEFT JOIN
			"subject"."lesson" l
			ON "sl"."lesson_id" = "l"."id"
		LEFT JOIN
			"subject"."subject" s
			ON "l"."subject_id" = "s"."id"
		WHERE
		    "sl"."id" = $1
`
	var subjectId int
	err := postgresRepository.Database.QueryRowx(query, subLessonId).Scan(&subjectId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &subjectId, nil
}
