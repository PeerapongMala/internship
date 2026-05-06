package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LearningAreaCaseGetCurriculumGroupId(learningAreaId int) (*int, error) {
	query := `
		SELECT
			"curriculum_group_id"
		FROM
			"curriculum_group"."learning_area"
		WHERE
			"id" = $1	
	`
	var curriculumGroupId *int
	err := postgresRepository.Database.QueryRowx(
		query,
		learningAreaId,
	).Scan(&curriculumGroupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return curriculumGroupId, nil
}
