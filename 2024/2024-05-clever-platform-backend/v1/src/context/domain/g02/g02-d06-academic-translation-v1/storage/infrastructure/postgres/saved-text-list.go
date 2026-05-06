package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d06-academic-translation-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SavedTextList(curriculumGroupId int, filter *constant.SavedTextFilter, pagination *helper.Pagination) ([]constant.SavedTextListDataEntity, error) {
	query := `
		SELECT
			"st"."id",
			"st"."group_id",
			"st"."language",
			"st"."text",
			"st"."text_to_ai",
			"st"."speech_url",
			"st"."updated_at",
			"u"."first_name" AS "updated_by",
			"st"."status"
		FROM 
			"curriculum_group"."saved_text"	st
		LEFT JOIN
			"user"."user" u
			ON "st"."updated_by" = "u"."id"
		WHERE
			"curriculum_group_id" = $1
	`
	args := []interface{}{curriculumGroupId}
	argsIndex := 2

	if filter.Language != "" {
		query += fmt.Sprintf(` AND "st"."language" = $%d`, argsIndex)
		args = append(args, filter.Language)
		argsIndex++
	}
	if filter.Text != "" {
		query += fmt.Sprintf(` AND "st"."text" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Text+"%")
		argsIndex++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "st"."status" = $%d`, argsIndex)
		args = append(args, filter.Status)
		argsIndex++
	}
	query += fmt.Sprintf(` AND "st"."status" != $%d`, argsIndex)
	args = append(args, constant.SavedTextHidden)
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
		query += fmt.Sprintf(` ORDER BY "st"."id" ASC OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
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
