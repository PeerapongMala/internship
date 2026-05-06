package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LessonGet(lessonId int) (*constant.LessonEntity, error) {
	query := `
		SELECT
			"id",
			"status"
		FROM "subject"."lesson"	
		WHERE
			"id" = $1
	`
	lessonEntity := constant.LessonEntity{}
	err := postgresRepository.Database.QueryRowx(query, lessonId).StructScan(&lessonEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &lessonEntity, err
}
