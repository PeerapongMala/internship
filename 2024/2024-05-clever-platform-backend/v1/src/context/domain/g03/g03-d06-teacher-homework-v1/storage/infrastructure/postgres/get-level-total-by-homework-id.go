package postgres

import (
	"log"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetLevelTotalByHomeworkId(homeworkId int) (int, error) {
	
	query := `
		SELECT count(DISTINCT htl.level_id)
		FROM homework.homework_template_level htl
		LEFT JOIN homework.homework_template ht 
		ON htl.homework_template_id = ht.id 
		LEFT JOIN homework.homework h 
		ON h.homework_template_id = ht.id
		WHERE h.id = $1
	`

	var count int
	err := postgresRepository.Database.QueryRowx(query, homeworkId).Scan(&count)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return 0, err
	}

	return count, err
}

func (postgresRepository *postgresRepository) GetLevelsByHomeworkId(homeworkId int) ([]int, error) {
	
	query := `
		SELECT DISTINCT htl.level_id
		FROM homework.homework_template_level htl
		LEFT JOIN homework.homework_template ht 
		ON htl.homework_template_id = ht.id 
		LEFT JOIN homework.homework h 
		ON h.homework_template_id = ht.id
		WHERE h.id = $1
	`

	rows, err := postgresRepository.Database.Queryx(query, homeworkId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	var levelIds []int
	for rows.Next() {
		var levelId int
		err := rows.Scan(&levelId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		levelIds = append(levelIds, levelId)
	}

	return levelIds, err
}