package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) YearList(pagination *helper.Pagination, curriculumGroupId int) ([]constant.YearEntity, error) {
	query := `
		SELECT
			"y"."id",
			"sy"."name",
			"sy"."short_name"	
		FROM "curriculum_group"."year" y
		LEFT JOIN "curriculum_group"."seed_year" sy
			ON "y"."seed_year_id" = "sy"."id"
		WHERE
			"y"."curriculum_group_id" = $1
	`
	if pagination != nil {
		countQuery := fmt.Sprintf(` SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, curriculumGroupId).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	query += fmt.Sprintf(` ORDER BY "y"."id" LIMIT $2 OFFSET $3`)

	yearEntities := []constant.YearEntity{}
	err := postgresRepository.Database.Select(&yearEntities, query, curriculumGroupId, pagination.Limit, pagination.Offset)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return yearEntities, nil
}
