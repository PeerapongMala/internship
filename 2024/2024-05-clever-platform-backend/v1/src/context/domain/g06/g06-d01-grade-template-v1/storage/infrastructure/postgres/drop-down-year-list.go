package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) YearList(pagination *helper.Pagination, schoolId int) ([]constant.YearEntity, error) {
	query := `
		SELECT
			"sy"."id",
			"sy"."name",
			"sy"."short_name"	
		FROM "curriculum_group"."seed_year" sy
	`
	if pagination != nil {
		countQuery := fmt.Sprintf(` SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	query += ` ORDER BY "sy"."short_name" LIMIT $1 OFFSET $2`

	yearEntities := []constant.YearEntity{}
	err := postgresRepository.Database.Select(&yearEntities, query, pagination.Limit, pagination.Offset)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return yearEntities, nil
}
