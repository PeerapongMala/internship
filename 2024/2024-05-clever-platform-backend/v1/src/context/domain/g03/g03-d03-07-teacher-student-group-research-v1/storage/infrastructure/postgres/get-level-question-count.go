package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetLevelQuestionCount(levelId int) (count int, err error) {
	query := `
		SELECT
			COUNT(*)
		FROM question.question q
		INNER JOIN "level"."level" l ON "q"."level_id" = "l"."id"
		WHERE "l"."id" = $1
	`
	err = postgresRepository.Database.Get(&count, query, levelId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return 0, err
	}
	return count, nil
}
