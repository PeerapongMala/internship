package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) IndicatorCaseGetByShortName(tx *sqlx.Tx, shortName string, curriculumGroupId int) (*int, error) {
	query := `
		SELECT
			"i"."id"
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
		    "i"."short_name" = $1
			AND
			"la".curriculum_group_id = $2
`
	var indicatorId int
	err := tx.QueryRowx(query, shortName, curriculumGroupId).Scan(&indicatorId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &indicatorId, nil
}
