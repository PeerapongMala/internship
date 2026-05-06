package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SeedSubjectGroupList(pagination *helper.Pagination) ([]constant.SeedSubjectGroupEntity, error) {
	query := `
		SELECT
			*
		FROM "curriculum_group"."seed_subject_group"
`
	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
	query += fmt.Sprintf(` OFFSET $1 LIMIT $2`)

	err := postgresRepository.Database.QueryRowx(countQuery).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+V", errors.WithStack(err))
		return nil, err
	}

	seedSubjectGroupEntities := []constant.SeedSubjectGroupEntity{}
	err = postgresRepository.Database.Select(&seedSubjectGroupEntities, query, pagination.Offset, pagination.Limit)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return seedSubjectGroupEntities, nil
}
