package postgres

import (
	"database/sql"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) CheckLevelPassed(levelId int, userId string) (*bool, *int, error) {
	query := `
		SELECT 
    		EXISTS (
        		SELECT 1
        		FROM "level"."level_play_log" lpl
        		WHERE
					"lpl"."level_id" = $1
        			AND "lpl"."star" >= 1
					AND "lpl"."student_id" = $2
    		),
    		COALESCE(MAX("lpl"."star"), 0)
		FROM "level"."level_play_log" lpl
		WHERE
			"lpl"."level_id" = $1
			AND "lpl"."student_id" = $2
		GROUP BY
			"lpl"."level_id"
	`
	isPassed := false
	maxStars := 0
	err := postgresRepository.Database.QueryRowx(query, levelId, userId).Scan(&isPassed, &maxStars)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		log.Printf("%+v", errors.WithStack(err))
		return nil, nil, err
	}

	return &isPassed, &maxStars, nil
}
