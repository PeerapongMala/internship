package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubCriteriaTopicCaseGetByShortName(curriculumGroupId int, shortName string) (*constant.SubCriteriaTopicEntity, error) {
	query := `
		SELECT
			"sct".*
		FROM "curriculum_group"."sub_criteria_topic" sct
		LEFT JOIN "curriculum_group"."sub_criteria" sc
			ON "sct"."sub_criteria_id" = "sc"."id"
		WHERE 
			"sc"."curriculum_group_id" = $1
			AND
			"sct"."short_name" = $2
	`
	subCriteriaTopicEntity := constant.SubCriteriaTopicEntity{}
	err := postgresRepository.Database.QueryRowx(query, curriculumGroupId, shortName).StructScan(&subCriteriaTopicEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &subCriteriaTopicEntity, nil
}
