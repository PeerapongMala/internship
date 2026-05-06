package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

// AcademicYearOptionListGetByParams implements storageRepository.Repository.
func (p *postgresRepository) AcademicYearOptionListGetByParams(in constant.OptionParam) ([]constant.OptionItem, error) {
	stm := `
	SELECT
		DISTINCT(c.academic_year) AS id,
		c.academic_year AS label

	FROM "class".class AS c
	INNER JOIN "class".study_group AS sg ON sg.class_id = c.id
	INNER JOIN school.class_teacher AS ct ON sg.class_id = ct.class_id
	WHERE sg.id = $1 AND ct.teacher_id = $2
`

	closingQuery := "ORDER BY c.academic_year DESC"
	queryBuilder := helper.NewQueryBuilder(stm, in.StudyGroupId, in.TeacherId)

	queryBuilder.AddClosingQuery(closingQuery)
	query, args := queryBuilder.Build()

	var data []constant.OptionItem
	if err := p.Database.Select(&data, query, args...); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return data, nil
}
