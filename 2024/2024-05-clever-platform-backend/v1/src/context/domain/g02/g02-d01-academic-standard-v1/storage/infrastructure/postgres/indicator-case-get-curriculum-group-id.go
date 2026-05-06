package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) IndicatorCaseGetCurriculumGroupId(indicatorId int) (*int, error) {
	query := `
		SELECT
			"la"."curriculum_group_id"
		FROM
			"curriculum_group"."indicator" i 
		LEFT JOIN 
			"curriculum_group"."learning_content" lc	
			ON "i"."learning_content_id" = "lc"."id"
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
			"i"."id" = $1
	`
	var curriculumGroupId *int
	err := postgresRepository.Database.QueryRowx(query, indicatorId).Scan(&curriculumGroupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return curriculumGroupId, nil
}
