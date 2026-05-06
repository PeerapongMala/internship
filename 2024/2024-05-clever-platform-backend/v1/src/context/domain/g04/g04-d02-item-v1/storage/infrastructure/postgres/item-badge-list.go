package postgres

import (
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) ListItemBadges(pagination *helper.Pagination, filter constant.ItemListFilter) (*[]constant.ItemAndBadgeResponse, error) {
	badges := []constant.ItemAndBadgeResponse{}
	listQuery := `
			SELECT 
			"item"."id",
			"item"."type",
			"item"."name",
			"item"."description",
			"item"."image_url",
			"item"."status",
			"item"."created_at",
			u2."first_name" AS "created_name",
			"item"."updated_at",
			u."first_name" AS "updated_name" ,
			"item"."created_by",
			"u"."first_name" AS "updated_by",
			"item"."id" AS item_id,
			COALESCE(badge.badge_description ,'') badge_description,
			COALESCE(badge.template_path,'') template_path
			FROM "item"."item" 
			LEFT JOIN "user"."user" u ON "item"."item".updated_by = u.id
			LEFT JOIN "user"."user" u2 ON "item"."item".created_by = u2.id
			LEFT JOIN "item"."badge" badge ON "item"."item".id = badge.item_id`

	values := []interface{}{}
	listQuery += ` WHERE "item"."type" = 'badge' AND "item"."teacher_item_group_id" IS NULL`
	if filter.SearchText != nil {
		listQuery += ` AND ("item"."name" LIKE $` + strconv.Itoa(len(values)+1) + ` OR "item"."description" LIKE $` + strconv.Itoa(len(values)+2) + ")"
		values = append(values, "%"+*filter.SearchText+"%")
		values = append(values, "%"+*filter.SearchText+"%")
	}

	if filter.Status != nil {
		listQuery += ` AND "item"."status" = $` + strconv.Itoa(len(values)+1)
		values = append(values, *filter.Status)
	}

	queryRows := `SELECT count(id) FROM (` + listQuery + `)`
	err := postgresRepository.Database.QueryRow(queryRows, values...).Scan(&pagination.TotalCount)
	if err != nil {
		return &badges, err
	}
	if pagination != nil {
		listQuery += ` ORDER BY "item"."id" LIMIT $` + strconv.Itoa(len(values)+1) + ` OFFSET $` + strconv.Itoa(len(values)+2)
		values = append(values, pagination.Limit)
		values = append(values, pagination.Offset)
	}

	rows, err := postgresRepository.Database.Queryx(listQuery, values...)
	if err != nil {
		return &badges, err
	}

	defer rows.Close()
	for rows.Next() {
		var badge constant.ItemAndBadgeResponse
		err = rows.Scan(
			&badge.Id,
			&badge.Type,
			&badge.Name,
			&badge.Description,
			&badge.ImageUrl,
			&badge.Status,
			&badge.CreateAt,
			&badge.CreateName,
			&badge.UpdateAt,
			&badge.UpdateName,
			&badge.CreateBy,
			&badge.UpdateBy,
			&badge.Badge.ItemId,
			&badge.BadgeDescription,
			&badge.TemplatePath,
		)
		if err != nil {
			return &badges, err
		}

		if badge.Id > 0 {
			badges = append(badges, badge)
		}
	}
	return &badges, nil
}
