package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LevelCaseCheckIfExists(subLessonId int, index int) (*bool, error) {
	query := `
		SELECT EXISTS (
			SELECT 1
			FROM "level"."level"
			WHERE
				"sub_lesson_id" = $1
				AND
				"index" = $2
				AND
				"status" != $3
		)
	`
	var isExists *bool
	err := postgresRepository.Database.QueryRowx(
		query,
		subLessonId,
		index,
		constant.Disabled,
	).Scan(&isExists)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return isExists, nil
}
