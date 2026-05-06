package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LessonCaseListBySubject(subjectId int) ([]constant.LessonDataEntity, error) {
	query := `
		SELECT
			"l"."id",
			"l"."index",
			"l"."name"	
		FROM "subject"."lesson" l
		WHERE
			"l"."subject_id" = $1
		ORDER BY "l"."id" 
	`
	lessonDataEntities := []constant.LessonDataEntity{}
	err := postgresRepository.Database.Select(&lessonDataEntities, query, subjectId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return lessonDataEntities, nil
}
