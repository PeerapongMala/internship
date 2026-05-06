package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ContentCaseGetCurriculumGroupId(contentId int) (*int, error) {
	query := `
		SELECT
			"la"."curriculum_group_id"
		FROM
			"curriculum_group"."content" c
		LEFT JOIN
			"curriculum_group"."learning_area" la	
			ON "c"."learning_area_id" = "la"."id"
		WHERE
			"c"."id" = $1
	`
	var curriculumGroupId *int
	err := postgresRepository.Database.QueryRowx(query, contentId).Scan(&curriculumGroupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return curriculumGroupId, nil
}
