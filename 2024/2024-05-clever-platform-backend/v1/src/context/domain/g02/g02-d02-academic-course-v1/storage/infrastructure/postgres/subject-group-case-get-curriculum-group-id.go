package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubjectGroupCaseGetCurriculumGroupId(subjectGroupId int) (*int, error) {
	query := `
		SELECT
			"curriculum_group_id"
		FROM "curriculum_group"."subject_group" sg	
		LEFT JOIN "curriculum_group"."year" y
			ON "sg"."year_id" = "y"."id"
		WHERE "sg"."id" = $1
	`
	var curriculumGroupId int
	err := postgresRepository.Database.QueryRowx(query, subjectGroupId).Scan(&curriculumGroupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &curriculumGroupId, nil
}
