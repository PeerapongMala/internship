package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) IndicatorListBySubject(subjectId int) ([]constant.IndicatorEntity, error) {
	query := `
		SELECT
		    DISTINCT ON (i.id)
			i.id AS "id",
			i.name AS "name"
		FROM subject.sub_lesson sl
		INNER JOIN subject.lesson l ON sl.lesson_id = l.id
		INNER JOIN curriculum_group.indicator i ON sl.indicator_id = i.id
		WHERE l.subject_id = $1`

	indicators := []constant.IndicatorEntity{}
	err := postgresRepository.Database.Select(&indicators, query, subjectId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return indicators, err
}
