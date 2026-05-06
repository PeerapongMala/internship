package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SeedPlatformList(pagination *helper.Pagination) ([]constant.SeedPlatformEntity, error) {
	query := `
		SELECT
			"id",
			"name"
		FROM
			"platform"."seed_platform"
`
	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s) `, query)
		query += fmt.Sprintf(` ORDER BY id OFFSET $1 LIMIT $2`)

		err := postgresRepository.Database.QueryRowx(countQuery).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	seedPlatformEntities := []constant.SeedPlatformEntity{}
	err := postgresRepository.Database.Select(&seedPlatformEntities, query, pagination.Offset, pagination.Limit)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return seedPlatformEntities, nil
}
