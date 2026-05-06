package postgres

import (
	"fmt"
	"github.com/pkg/errors"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) ListItem(pagination *helper.Pagination, filter constant.ItemListFilter) (*[]constant.ItemResponse, error) {
	response := []constant.ItemResponse{}
	listQuery := `SELECT 
	"item"."id",
	"item"."teacher_item_group_id",
	"item"."type",
	"item"."name",
	"item"."description",
	"item"."image_url",
	"item"."status",
	"item"."created_at",
	"item"."created_by",
	u2."first_name" AS "created_name",
	"item"."updated_at",
	u."first_name" AS "updated_by" 
	FROM "item"."item" 
	LEFT JOIN "user"."user" u ON "item"."item".updated_by = u.id
	LEFT JOIN "user"."user" u2 ON "item"."item".created_by = u2.id
	WHERE
	    "teacher_item_group_id" IS NULL
	`
	args := []interface{}{}
	argsIndex := len(args) + 1

	if filter.SearchText != nil {
		listQuery += fmt.Sprintf(` AND ("item"."name" ILIKE $%d OR "item"."description" ILIKE $%d )`, argsIndex, argsIndex)
		argsIndex++
		args = append(args, "%"+*filter.SearchText+"%")
	}
	if filter.Type != nil {
		listQuery += fmt.Sprintf(` AND "item"."type" = $%d`, argsIndex)
		argsIndex++
		args = append(args, filter.Type)
	}
	if filter.Status != nil {
		listQuery += fmt.Sprintf(` AND "item"."status" = $%d`, argsIndex)
		argsIndex++
		args = append(args, filter.Status)
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, listQuery)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		listQuery += fmt.Sprintf(` ORDER BY "item"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	err := postgresRepository.Database.Select(&response, listQuery, args...)
	if err != nil {
		return nil, err
	}

	return &response, nil
}
