package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) FormInfoByFormID(formID int) (*constant.FormDataDetail, error) {
	query := `
		SELECT 
			ef.id as id,
			s.name as school_name,
			sa.name as school_area
		FROM
			grade.evaluation_form ef
		LEFT JOIN school.school s ON s.id = ef.school_id
		LEFT JOIN school_affiliation.school_affiliation_school sas ON s.id = sas.school_id
		LEFT JOIN school_affiliation.school_affiliation sa ON sas.school_affiliation_id = sa.id
		WHERE ef.id = $1
	`

	var entity constant.FormDataDetail
	err := postgresRepository.Database.QueryRowx(query, formID).StructScan(&entity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &entity, nil
}
