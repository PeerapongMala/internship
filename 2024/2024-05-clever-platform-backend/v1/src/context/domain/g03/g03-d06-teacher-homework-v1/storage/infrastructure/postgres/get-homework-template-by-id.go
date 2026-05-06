package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetHomeworkTemplateById(id int) (*constant.HomeworkTemplateEntity, error) {
	
	query1 := `
		SELECT 
			*
		FROM
			homework.homework_template
		WHERE id = $1
	`

	query2 := `SELECT level_id FROM homework.homework_template_level WHERE homework_template_id = $1`

	var entity constant.HomeworkTemplateEntity
	err := postgresRepository.Database.QueryRowx(query1, id).StructScan(&entity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	rows, err := postgresRepository.Database.Queryx(query2, id)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	entity.LevelIds = []int{}
	for rows.Next() {
		var levelId int
		err := rows.Scan(&levelId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		entity.LevelIds = append(entity.LevelIds, levelId)
	}

	return &entity, nil
}
