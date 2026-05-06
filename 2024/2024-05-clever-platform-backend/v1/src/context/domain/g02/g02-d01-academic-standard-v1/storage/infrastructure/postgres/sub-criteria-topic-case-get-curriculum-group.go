package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubCriteriaTopicCaseGetCurriculumGroupId(subCriteriaTopicId int) (*int, error) {
	query := `
		SELECT
			"sc"."curriculum_group_id"
		FROM
		    "curriculum_group"."sub_criteria_topic" sct
		LEFT JOIN
			"curriculum_group"."sub_criteria" sc
			ON "sct"."sub_criteria_id" = "sc"."id"
		WHERE
			"sct"."id" = $1	
`
	var curriculumGroupId *int
	err := postgresRepository.Database.QueryRowx(query, subCriteriaTopicId).Scan(&curriculumGroupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return curriculumGroupId, nil
}
