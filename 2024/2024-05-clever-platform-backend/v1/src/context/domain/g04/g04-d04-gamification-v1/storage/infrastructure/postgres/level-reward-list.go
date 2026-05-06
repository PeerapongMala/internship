package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LevelRewardList(filter *constant.LevelRewardFilter, pagination *helper.Pagination) ([]constant.LevelRewardEntity, error) {
	query := `
		SELECT
			*
		FROM
		    "level"."level_reward"
		WHERE	
		    TRUE
`
	args := []interface{}{}
	argsIndex := 1

	if filter.SeedSubjectGroupId != 0 {
		query += fmt.Sprintf(` AND "seed_subject_group_id" = $%d`, argsIndex)
		args = append(args, filter.SeedSubjectGroupId)
		argsIndex++
	}
	if filter.LevelType != "" {
		query += fmt.Sprintf(` AND "level_type" = $%d`, argsIndex)
		args = append(args, filter.LevelType)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY id OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	levelRewardEntities := []constant.LevelRewardEntity{}
	err := postgresRepository.Database.Select(&levelRewardEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return levelRewardEntities, nil
}
