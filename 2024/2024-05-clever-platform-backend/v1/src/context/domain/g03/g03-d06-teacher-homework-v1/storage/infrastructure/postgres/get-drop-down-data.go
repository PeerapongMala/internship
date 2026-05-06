package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetClassListByYearId(schoolId int, yearId int) ([]constant.ClassListEntity, error) {

	query := `
		SELECT
		  c.id,
			CONCAT(c.year, '/', c.name, ' ', 'ปีการศึกษา ', c.academic_year) AS class_name
		FROM class.class c
		LEFT JOIN curriculum_group.seed_year sy
		ON sy.short_name = c.year
		WHERE c.school_id = $1
		AND sy.id = $2
		ORDER BY c.name	ASC
	`

	entities := []constant.ClassListEntity{}
	err := postgresRepository.Database.Select(&entities, query, schoolId, yearId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, err
}

func (postgresRepository *postgresRepository) GetYearList() ([]constant.YearListEntity, error) {

	query := `
		SELECT DISTINCT
		  id,
		  short_name AS year_name
		FROM curriculum_group.seed_year
		ORDER BY short_name ASC
	`

	entities := []constant.YearListEntity{}
	err := postgresRepository.Database.Select(&entities, query)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, err
}
