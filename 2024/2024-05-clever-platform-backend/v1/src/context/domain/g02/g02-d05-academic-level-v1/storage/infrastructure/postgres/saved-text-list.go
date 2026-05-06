package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SavedTextList(curriculumGroupId int, filter *constant.SavedTextFilter, pagination *helper.Pagination) ([]constant.SavedTextListDataEntity, error) {
	query := `
		SELECT
			"group_id",
			"language",
			"text",
			"speech_url"
		FROM "curriculum_group"."saved_text"	
		WHERE
			"curriculum_group_id" = $1
	`
	args := []interface{}{curriculumGroupId}
	argsIndex := 2

	if filter.Language != "" {
		query += fmt.Sprintf(` AND "language" = $%d`, argsIndex)
		args = append(args, filter.Language)
		argsIndex++
	}
	if filter.Text != "" {
		query += fmt.Sprintf(` AND "text" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Text+"%")
		argsIndex++
	}
	query += fmt.Sprintf(` AND "status" != $%d`, argsIndex)
	args = append(args, "hidden")
	argsIndex++

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "created_at" DESC OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	savedTextListDataEntities := []constant.SavedTextListDataEntity{}
	err := postgresRepository.Database.Select(&savedTextListDataEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return savedTextListDataEntities, nil
}
