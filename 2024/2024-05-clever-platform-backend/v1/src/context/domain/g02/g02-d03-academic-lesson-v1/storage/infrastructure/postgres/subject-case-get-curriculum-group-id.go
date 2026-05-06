package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubjectCaseGetCurriculumGroupId(subjectId int) (*int, error) {
	query := `
		SELECT
			"y"."curriculum_group_id"
		FROM	
			"subject"."subject" s
		LEFT JOIN "curriculum_group"."subject_group" sg	
			ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN "curriculum_group"."year" y
			ON "sg"."year_id" = "y"."id"
		WHERE
			"s"."id" = $1
	`
	var curriculumGroupId *int
	err := postgresRepository.Database.QueryRowx(query, subjectId).Scan(&curriculumGroupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return curriculumGroupId, nil
}
