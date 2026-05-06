package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubLessonCaseGetIndicator(subLessonId int) (*string, error) {
	query :=
		`
		SELECT
			"i"."short_name"
		FROM
			"subject"."sub_lesson" sl
		LEFT JOIN 	
			"curriculum_group"."indicator" i
			ON "sl"."indicator_id" = "i"."id"
		WHERE
			"sl"."id" = $1
	`
	var indicator string
	err := postgresRepository.Database.QueryRowx(query, subLessonId).Scan(&indicator)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &indicator, nil
}
