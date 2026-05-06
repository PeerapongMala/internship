package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) CriteriaCaseGetByShortName(curriculumGroupid int, shortName string) (*constant.CriteriaEntity, error) {
	query := `
		SELECT
			"c".*
		FROM "curriculum_group"."criteria" c
		LEFT JOIN "curriculum_group"."content" ct
			ON "c"."content_id" = "ct"."id"
		LEFT JOIN "curriculum_group"."learning_area" la
		  ON "ct"."learning_area_id" = "la"."id"
		WHERE
			"la"."curriculum_group_id" = $1
			AND
			"c"."short_name" = $2
	`
	criteriaEntity := constant.CriteriaEntity{}
	err := postgresRepository.Database.QueryRowx(query, curriculumGroupid, shortName).StructScan(&criteriaEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &criteriaEntity, nil
}
