package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetLevelByHomeWorkTemplateId(hwTemplateId *int) ([]int, error) {
	query := `
		SELECT DISTINCT 
			level_id
		FROM
			homework.homework_template_level htl
		WHERE htl.homework_template_id = $1
	`

	rows, err := postgresRepository.Database.Queryx(query, hwTemplateId)
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
