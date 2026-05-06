package postgres

import (
	"github.com/jmoiron/sqlx"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LevelCaseGetLevelToShift(tx *sqlx.Tx, subLessonId int, targetLevelIndex int) ([]constant.LevelEntity, error) {
	query := `
		SELECT
			*
		FROM "level"."level"
		WHERE
			"sub_lesson_id" = $1	
			AND
			"index" > $2
			AND
			"status" != $3
	`
	levelEntities := []constant.LevelEntity{}
	err := tx.Select(&levelEntities, query, subLessonId, targetLevelIndex, constant.Disabled)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return levelEntities, nil
}
