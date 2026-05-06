package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LearningContentCaseGetCurriculumGroupId(learningContentId int) (*int, error) {
	query := `
		SELECT
			"la"."curriculum_group_id"
		FROM 
			"curriculum_group"."learning_content" lc	
		LEFT JOIN
			"curriculum_group"."criteria" c
			ON "lc"."criteria_id" = "c"."id"
		LEFT JOIN
			"curriculum_group"."content" ct
			ON "c"."content_id" = "ct"."id"
		LEFT JOIN
			"curriculum_group"."learning_area" la
			ON "ct"."learning_area_id" = "la"."id"
		WHERE
			"lc"."id" = $1
	`
	var curriculumGroupId *int
	err := postgresRepository.Database.QueryRowx(query, learningContentId).Scan(&curriculumGroupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return curriculumGroupId, nil
}
