package postgres

import (
	"fmt"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetStars(userId string, subjectId int) (*int, error) {
	query := `
		SELECT
			COALESCE(SUM(stars), 0) AS "stars"
		FROM (
			SELECT
				DISTINCT "lpl"."level_id",
				MAX("lpl"."star") AS "stars"
			FROM "level"."level_play_log" lpl
			INNER JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
			INNER JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
			INNER JOIN "subject"."lesson" ls ON "sl"."lesson_id" = "ls"."id"
			WHERE 
				"lpl"."student_id" = $1
	`
	args := []interface{}{userId}
	argsIndex := len(args) + 1

	if subjectId != 0 {
		query += fmt.Sprintf(` AND "ls"."subject_id" = $%d`, argsIndex)
		args = append(args, subjectId)
		argsIndex++
	}

	query += `
			GROUP BY "lpl"."level_id"
		) AS "level_stars"
	`

	stars := 0
	err := postgresRepository.Database.QueryRowx(query, args...).Scan(&stars)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &stars, nil
}
