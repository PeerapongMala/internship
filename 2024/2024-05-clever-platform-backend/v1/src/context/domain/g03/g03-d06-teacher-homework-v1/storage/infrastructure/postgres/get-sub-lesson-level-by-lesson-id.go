package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetSubLessonLevelByLessonId(lessonId int) ([]constant.SubLessonLevelEntity, error) {
	
	query := `
		SELECT 
			sl.id AS sub_lesson_id,
			sl."name" AS sub_lesson_name,
			sl."index" AS sub_lesson_index,
			l.id AS level_id,
			l."index" AS level_index,
			l.difficulty AS level_difficulty
		FROM subject.sub_lesson sl
		LEFT JOIN "level"."level" l 
		ON l.sub_lesson_id = sl.id
		WHERE sl.status = 'enabled'
		AND l.status = 'enabled'
		AND sl.lesson_id = $1
		ORDER BY sl.id, sl."index"
	`

	entities := []constant.SubLessonLevelEntity{}
	err := postgresRepository.Database.Select(&entities, query, lessonId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, err
}