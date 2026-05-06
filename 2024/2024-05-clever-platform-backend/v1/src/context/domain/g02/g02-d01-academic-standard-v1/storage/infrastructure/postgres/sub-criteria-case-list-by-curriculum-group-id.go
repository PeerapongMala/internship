package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubCriteriaCaseListByCurriculumGroupId(curriculumGroupId int) ([]constant.SubCriteriaEntity, error) {
	query := `
		SELECT 
			*
		FROM "curriculum_group"."sub_criteria" sc
		WHERE
			"curriculum_group_id" = $1	
		ORDER BY "sc"."index"
	`
	subCriteriaEntities := []constant.SubCriteriaEntity{}
	err := postgresRepository.Database.Select(&subCriteriaEntities, query, curriculumGroupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subCriteriaEntities, nil
}
