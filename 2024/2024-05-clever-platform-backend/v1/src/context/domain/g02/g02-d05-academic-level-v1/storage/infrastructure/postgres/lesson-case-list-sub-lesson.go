package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LessonCaseListSubLesson(tx *sqlx.Tx, lessonIds []int) ([]int, error) {
	queryMethod := postgresRepository.Database.Select
	if tx != nil {
		queryMethod = tx.Select
	}

	query := `
		SELECT
			"sl"."id"
		FROM "subject"."lesson" ls
		INNER JOIN "subject"."sub_lesson" sl ON "ls"."id" = "sl"."lesson_id"
		WHERE "ls"."id" = ANY($1)
	`
	subLessonIds := []int{}
	err := queryMethod(&subLessonIds, query, lessonIds)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subLessonIds, err
}
