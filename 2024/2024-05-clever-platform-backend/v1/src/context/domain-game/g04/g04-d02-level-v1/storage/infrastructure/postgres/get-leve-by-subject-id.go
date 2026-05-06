package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetLevelBySubjectId(subjectId int) ([]int, error) {
	query := `
		SELECT
			l.id
		FROM level.level l
		LEFT JOIN subject.sub_lesson sl 
		ON l.sub_lesson_id = sl.id  
		LEFT JOIN subject.lesson l2 
		ON sl.lesson_id = l2.id 
		WHERE l2.subject_id = $1
	`

	rows, err := postgresRepository.Database.Queryx(query, subjectId)
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
