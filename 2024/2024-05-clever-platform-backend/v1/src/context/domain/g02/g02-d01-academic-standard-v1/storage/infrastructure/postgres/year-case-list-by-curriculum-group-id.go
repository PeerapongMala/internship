package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) YearCaseListByCurriculumGroupId(pagination *helper.Pagination, curriculumGroupId int) ([]constant.YearEntity, error) {
	query := `
		SELECT
			"y"."id",
			CONCAT("sp"."name", ' - ', "sy"."short_name") AS "seed_year_name"	
		FROM "curriculum_group"."year" y
		INNER JOIN "curriculum_group"."platform" p ON "y"."platform_id" = "p"."id"
		INNER JOIN "platform"."seed_platform" sp ON "p"."seed_platform_id" = "sp"."id"
		INNER JOIN "curriculum_group"."seed_year" sy ON "y"."seed_year_id" = "sy"."id"
		WHERE
			"y"."curriculum_group_id" = $1
	`
	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, curriculumGroupId).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	query += fmt.Sprintf(` ORDER BY "seed_year_name" LIMIT $2 OFFSET $3`)

	yearEntities := []constant.YearEntity{}
	err := postgresRepository.Database.Select(&yearEntities, query, curriculumGroupId, pagination.Limit, pagination.Offset)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return yearEntities, nil
}
