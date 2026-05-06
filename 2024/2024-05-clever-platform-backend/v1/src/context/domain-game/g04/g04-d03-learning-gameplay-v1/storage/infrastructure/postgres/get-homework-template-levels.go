package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1/constant"
)

func (postgresRepository *postgresRepository) GetHomeworkTemplateLevels(homeworkId int) (entities []constant.HomeworkTemplateLevel, err error) {
	query := `
		SELECT 
    		ht.id AS homework_template_id,
    		htl.level_id
		FROM
    		homework.homework h
    	JOIN homework.homework_template ht ON h.homework_template_id = ht.id
    	JOIN homework.homework_template_level htl ON ht.id = htl.homework_template_id
		WHERE
    		h.id = $1
	`
	args := []interface{}{homeworkId}

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		item := constant.HomeworkTemplateLevel{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)

	}
	return
}
