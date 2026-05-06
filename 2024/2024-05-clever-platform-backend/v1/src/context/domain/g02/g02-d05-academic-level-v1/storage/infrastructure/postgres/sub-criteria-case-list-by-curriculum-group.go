package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubCriteriaCaseListByCurriculumGroup(curriculumGroupId int) ([]constant.SubCriteriaDataEntity, error) {
	subCriteriaQuery := `
		SELECT
			"id",
			"name",
			"index"
		FROM "curriculum_group"."sub_criteria" sc
		WHERE
			"sc"."curriculum_group_id" = $1
	`
	subCriteriaEntities := []constant.SubCriteriaDataEntity{}
	err := postgresRepository.Database.Select(&subCriteriaEntities, subCriteriaQuery, curriculumGroupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	subCriteriaTopicQuery := `
		SELECT
			"id",
			"name",
			"short_name"	
		FROM "curriculum_group"."sub_criteria_topic" sct
		WHERE
			"sct"."sub_criteria_id" = $1
			AND
			"status" = $2
	`
	for i, subCriteriaEntity := range subCriteriaEntities {
		subCriteriaTopicEntities := []constant.SubCriteriaTopicDataEntity{}
		err := postgresRepository.Database.Select(&subCriteriaTopicEntities, subCriteriaTopicQuery, subCriteriaEntity.Id, constant.Enabled)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		subCriteriaEntities[i].SubCriteriaTopics = subCriteriaTopicEntities
	}

	return subCriteriaEntities, nil
}
