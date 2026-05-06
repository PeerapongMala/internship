package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetLevelBySubLessonId(subLessonId int) ([]int, error) {
	query := `
		SELECT
			id
		FROM
			level.level l
		WHERE l.status = 'enabled'
		AND l.sub_lesson_id = $1
	`

	rows, err := postgresRepository.Database.Queryx(query, subLessonId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	resp := []int{}
	for rows.Next() {
		var levelId int
		err := rows.Scan(&levelId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		resp = append(resp, levelId)
	}

	return resp, nil
}
