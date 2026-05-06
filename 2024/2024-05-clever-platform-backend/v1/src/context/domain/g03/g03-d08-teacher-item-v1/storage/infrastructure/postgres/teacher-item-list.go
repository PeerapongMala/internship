package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d08-teacher-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) TeacherItemList(pagination *helper.Pagination, filter constant.TeacherItemFilter, teacherId string) ([]constant.ItemEntity, error) {
	query := `
		SELECT
			"i"."id",
			"i"."image_url",
			"b"."template_path",
			"i2"."image_url" AS "template_image_url",
			"i2"."name" AS "template_item",
			"b"."badge_description",
			"i"."name",
			"i"."type",
			"i"."description",
			"u2"."first_name" AS "created_by",
			"i"."updated_at",
			"u"."first_name" AS "updated_by",
			"i"."status"
		FROM
			"teacher_item"."teacher_item_group" tig
		LEFT JOIN
			"item"."item" i ON "tig"."id" = "i"."teacher_item_group_id"
		LEFT JOIN
			"item"."badge" b ON "i"."id" = "b"."item_id"
		LEFT JOIN
			"item"."item" i2 ON "i"."template_item_id" = "i2"."id"
		LEFT JOIN
			"user"."user" u ON "i"."updated_by" = "u"."id"
		LEFT JOIN
			"user"."user" u2 ON "i"."created_by" = "u2"."id"
		WHERE
			"tig"."subject_id" = $1
			AND "tig"."teacher_id" = $2
	`
	args := []interface{}{filter.SubjectId, filter.TeacherId}
	argsIndex := len(args) + 1

	if filter.Id != "" {
		query += fmt.Sprintf(` AND "i"."id"::TEXT ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Id+"%")
		argsIndex++
	}
	if filter.Type != "" {
		query += fmt.Sprintf(` AND "i"."type" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Type+"%")
		argsIndex++
	}
	if filter.Name != "" {
		query += fmt.Sprintf(` AND "i"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Name+"%")
		argsIndex++
	}
	if filter.Description != "" {
		query += fmt.Sprintf(` AND "i"."description" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Description+"%")
		argsIndex++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "i"."status" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Status+"%")
		argsIndex++
	}

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
		query += fmt.Sprintf(` ORDER BY "i"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	itemEntities := []constant.ItemEntity{}
	err := postgresRepository.Database.Select(&itemEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return itemEntities, nil
}
