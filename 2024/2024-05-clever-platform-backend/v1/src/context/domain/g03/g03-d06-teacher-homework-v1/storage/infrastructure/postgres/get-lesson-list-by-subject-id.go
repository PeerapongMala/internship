package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetLessonListBySubjectId(subjectId int) ([]constant.LessonListEntity, error) {

	query := `
		SELECT
			id,
		  	name AS "name"
		FROM subject.lesson
		WHERE subject_id = $1
		ORDER BY id
	`

	entities := []constant.LessonListEntity{}
	err := postgresRepository.Database.Select(&entities, query, subjectId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, err
}
