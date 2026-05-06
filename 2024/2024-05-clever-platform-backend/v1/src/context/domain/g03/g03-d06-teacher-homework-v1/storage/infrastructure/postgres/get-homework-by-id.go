package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetHomeworkById(id int) (*constant.HomeworkEntity, error) {
	
	query := `
		SELECT 
			*
		FROM
			homework.homework
		WHERE id = $1
	`

	var entity constant.HomeworkEntity
	err := postgresRepository.Database.QueryRowx(query, id).StructScan(&entity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &entity, nil
}
