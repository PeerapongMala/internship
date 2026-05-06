package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

// SubLessonOptionListGetByParams implements storageRepository.Repository.
func (p *postgresRepository) SubLessonOptionListGetByParams(in constant.OptionParam) ([]constant.OptionItem, error) {
	stm := `
	SELECT
		sl.id,
		sl.name AS label,
		sl.lesson_id AS parent_id

	FROM subject.sub_lesson sl
	INNER JOIN subject.lesson ls ON ls.id = sl.lesson_id
	INNER JOIN "class".study_group sg ON sg.subject_id = ls.subject_id
	INNER JOIN school.class_teacher ct ON sg.class_id = ct.class_id
	WHERE sg.id = $1 AND ct.teacher_id = $2
`

	closingQuery := "ORDER BY sl.name ASC"
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
