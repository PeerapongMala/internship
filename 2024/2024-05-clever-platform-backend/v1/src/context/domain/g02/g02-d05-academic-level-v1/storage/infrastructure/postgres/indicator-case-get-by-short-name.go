package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) IndicatorCaseGetByShortName(curriculumGroupId int, shortName string) (*constant.IndicatorEntity, error) {
	query := `
		SELECT 
			"i".*
		FROM "curriculum_group"."indicator" i
		LEFT JOIN "curriculum_group"."learning_content" lc
			ON "i"."learning_content_id" = "lc"."id"
		LEFT JOIN "curriculum_group"."criteria" c
			ON "lc"."criteria_id" = "c"."id"
		LEFT JOIN "curriculum_group"."content" ct
			ON "c"."content_id" = "ct"."id"
		LEFT JOIN "curriculum_group"."learning_area" la
			ON "ct"."learning_area_id" = "la"."id"
		WHERE
			"la"."curriculum_group_id" = $1	
			AND
			"i"."short_name" = $2
	`
	indicatorEntity := constant.IndicatorEntity{}
	err := postgresRepository.Database.QueryRowx(query, curriculumGroupId, shortName).StructScan(&indicatorEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &indicatorEntity, nil
}
