package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d06-grade-porphor6-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradPorphor6GetByStudentId(id string) (*constant.GradePorphor6DataEntity, error) {
	query := `
		SELECT
			id,
			learning_area_name,
			student_id,
			data_json,
			created_at
		FROM
			grade.porphor6_data
		WHERE student_id = $1
	`

	var entity constant.GradePorphor6DataEntity
	err := postgresRepository.Database.QueryRowx(query, id).StructScan(&entity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &entity, nil

}
